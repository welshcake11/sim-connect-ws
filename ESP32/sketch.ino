#include <ArduinoWebsockets.h>
#include <WiFi.h> 
#include <MAX7219plus.h>

const char* ssid = ""; //Enter WiFi Network SSID
const char* password = ""; //Enter Password
const char* websockets_server = "ws://192.168.68.123:3000"; //server adress and port

uint8_t SDIN_PIN = 18;  // Data Pin
uint8_t SCLK_PIN = 21;  // Clock Pin
uint8_t CS1_PIN = 19;   // Chip Select Pin
uint16_t CommDelay = 0;  
char* endPtr;

MAX7219plus_Model6 myMAX(CS1_PIN, SCLK_PIN, SDIN_PIN, CommDelay, 1);

using namespace websockets;

void onMessageCallback(WebsocketsMessage message) {
      
    myMAX.ClearDisplay();

    long val = atol(message.data().c_str());
 
    myMAX.DisplayIntNum(val, myMAX.AlignRight);
 
}

void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionOpened) {
        Serial.println("Connnection Opened");
    } else if(event == WebsocketsEvent::ConnectionClosed) {
        Serial.println("Connnection Closed");
    } else if(event == WebsocketsEvent::GotPing) {
        Serial.println("Got a Ping!");
    } else if(event == WebsocketsEvent::GotPong) {
        Serial.println("Got a Pong!");
    }
}

WebsocketsClient client;
void setup() {
    
    Serial.begin(115200);

    myMAX.InitDisplay(myMAX.ScanEightDigit, myMAX.DecodeModeNone);
	myMAX.ClearDisplay();

    // Connect to wifi
    WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    Serial.println("wifi connected");
 
    // Setup Callbacks
    client.onMessage(onMessageCallback);
    client.onEvent(onEventsCallback);
    
    client.setInsecure();

    // Connect to server
    client.connect(websockets_server);
 
}

void loop() {
    client.poll();
}