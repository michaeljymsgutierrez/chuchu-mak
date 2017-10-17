#include <Firebase.h>
#include <FirebaseArduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Servo.h> 

Servo door; //name of the servo

int leds[3] = {D0, D1, D2};
int states[3] = {LOW, LOW, LOW};
int totalDevices = 3;

//fire credentials
#define firebaseURl "homeautomation-6357b.firebaseio.com"
#define authCode "ucPnfDVvA8dXEPKy6zheNpfElOm8d0AUbHz5NGGl"

// Update these with values suitable for your network.
const char* ssid = "Pawer"; // change to your home wifi name
const char* password = "shitness"; //  change to your home wifi password
const char* mqtt_server = "io.reteiot.com"; // MQTT broker Name 
String chipId = "Lights";

#define DEBOUNCE 10
byte buttons[] = {D8, D5, D6};
#define NUMBUTTONS sizeof(buttons)
byte pressed[NUMBUTTONS], justpressed[NUMBUTTONS], justreleased[NUMBUTTONS];
byte previous_keystate[NUMBUTTONS], current_keystate[NUMBUTTONS];

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setupFirebase() {

  Firebase.begin(firebaseURl, authCode);
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == 'o' && (char)payload[1]== 'n') { // Here we are comparing if ON command is coming from server. 
      
  //  digitalWrite(D7, HIGH);
    digitalWrite(D3, HIGH);
   
  } else {
   // digitalWrite(D7, LOW); // else turn off led 
    digitalWrite(D3, LOW); 
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
       digitalWrite(BUILTIN_LED, LOW);
      client.subscribe("mharrvic@gmail.com/facebook-light"); //  chnage your email id , you can also change facebook-led and keep what ever device name here.
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
ESP.wdtDisable();
ESP.wdtEnable(WDTO_8S);
  
door.attach(15); // attaching Servo to GPIO15

  pinMode(BUILTIN_LED, OUTPUT);     // on board led for mqtt status indication.
//  pinMode(D7, OUTPUT); // our Buzzer is connected to D7
  pinMode(D3, OUTPUT); // lED
  Serial.begin(115200);
  
  setup_wifi();
  setupFirebase();
  setupLeds();
  setupButtons();
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  digitalWrite(BUILTIN_LED, HIGH);
  digitalWrite(D3, HIGH);


  
}

void getData() {
  
  //firebase
  //String path = chipId + "/Lights";
  String path = chipId;
  FirebaseObject object = Firebase.get(path);
  bool led1 = object.getBool("Light1");
  bool led2 = object.getBool("Light2");
  bool led3 = object.getBool("Light3");
  int doorServoStatus = object.getInt("DoorStatus")

  // write output high or low to turn on or off led
  digitalWrite(leds[0], led1);
  digitalWrite(leds[1], led2);
  digitalWrite(leds[2], led3);
  door.write(doorServoStatus);

}

void loop() {

    // door.write();

ESP.wdtFeed();
  if (!client.connected()) {
     digitalWrite(BUILTIN_LED, HIGH);
    reconnect();
  }
  client.loop();
  
   getData();
  byte ledIndex = thisSwitch_justPressed();
  String devicePath;

  switch (ledIndex)
  {
    case 0:
      devicePath = chipId + "/Light1";

      doOnOffLed(ledIndex, devicePath);

      break;
    case 1:
      devicePath = chipId + "/Light2";
      doOnOffLed(ledIndex, devicePath);
      break;
    case 2:
      devicePath = chipId + "/Light3";
      doOnOffLed(ledIndex, devicePath);
      break;
  }

 
}



// Firebase 
void doOnOffLed(int index, String path) {


  int state = !states[leds[index]];
  states[leds[index]] = state;
  digitalWrite(leds[index], state);


  // send to firebase server

  Firebase.setBool(path, state);

}

void setupLeds() {

  // setup Pin mode as output.


  for (int i; i < totalDevices; i++) {

    Serial.printf("Setup Output for pin %d", leds[i]);
    pinMode(leds[i], OUTPUT);

  }
}

void setupButtons() {


  byte i;

  // Make input & enable pull-up resistors on switch pins
  for (i = 0; i < NUMBUTTONS; i++) {
    pinMode(buttons[i], INPUT);
    digitalWrite(buttons[i], HIGH);
  }
}

void check_switches()
{
  static byte previousstate[NUMBUTTONS];
  static byte currentstate[NUMBUTTONS];
  static long lasttime;
  byte index;
  if (millis() < lasttime) {
    // we wrapped around, lets just try again
    lasttime = millis();
  }
  if ((lasttime + DEBOUNCE) > millis()) {
    // not enough time has passed to debounce
    return;
  }
  // ok we have waited DEBOUNCE milliseconds, lets reset the timer
  lasttime = millis();
  for (index = 0; index < NUMBUTTONS; index++) {
    justpressed[index] = 0;       //when we start, we clear out the "just" indicators
    justreleased[index] = 0;
    currentstate[index] = digitalRead(buttons[index]);   //read the button
    if (currentstate[index] == previousstate[index]) {
      if ((pressed[index] == LOW) && (currentstate[index] == LOW)) {
        // just pressed
        justpressed[index] = 1;
      }
      else if ((pressed[index] == HIGH) && (currentstate[index] == HIGH)) {
        justreleased[index] = 1; // just released
      }
      pressed[index] = !currentstate[index];  //remember, digital HIGH means NOT pressed
    }
    previousstate[index] = currentstate[index]; //keep a running tally of the buttons
  }
}


byte thisSwitch_justPressed() {
  byte thisSwitch = 255;
  check_switches();  //check the switches &amp; get the current state
  for (byte i = 0; i < NUMBUTTONS; i++) {
    current_keystate[i] = justpressed[i];
    if (current_keystate[i] != previous_keystate[i]) {
      if (current_keystate[i]) thisSwitch = i;
    }
    previous_keystate[i] = current_keystate[i];
  }
  return thisSwitch;
}



