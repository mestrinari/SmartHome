#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

#define umid A0

int LEDred = 5;   // D1
int umidade = A0;
int motor = 2;

const char* ssid = "CIDYCORP";
const char* password = "369852147123";

ESP8266WebServer server(80);

bool isMotorOn = false; // Variável para acompanhar o status do motor

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  pinMode(LEDred, OUTPUT);
  digitalWrite(LEDred, LOW);

  pinMode(motor, OUTPUT);
  digitalWrite(motor, LOW);

  pinMode(umid, INPUT);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("NodeMCU conectado no IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Conexão efetuada com sucesso!!!");

  server.on("/", []() {
    server.send(200, "text/plain", "BEM VINDO AO SERVIDOR DO NODEmcu");
  });

  server.on("/onred", []() {
    server.send(200, "text/plain", "LED Vermelha acesa");
    digitalWrite(LEDred, LOW);
    delay(1000);
  });

  server.on("/offred", []() {
    server.send(200, "text/plain", "LED Vermelha apagada");
    digitalWrite(LEDred, HIGH);
    delay(1000);
  });

  server.on("/offled1", []() {
    server.send(200, "text/plain", "Motor desligado");
    digitalWrite(motor, HIGH);
    isMotorOn = false; // Atualiza o status do motor
    delay(1000);
  });

  server.on("/onled1", []() {
    server.send(200, "text/plain", "Motor ligado");
    digitalWrite(motor, LOW);
    isMotorOn = true; // Atualiza o status do motor
    delay(1000);
  });

  server.on("/umidade", []() {
    int valorUmidade = analogRead(umid);
    String response = String(valorUmidade) + "," + (isMotorOn ? "1" : "0"); // Adicione o estado atual do motor à resposta
    server.send(200, "text/plain", response);
    delay(1000);
  });

  server.begin();
  Serial.println("Webserver inicializado");
  delay(5000);
  Serial.println("Acesse o endereço pelo: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
}
