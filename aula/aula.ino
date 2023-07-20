#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

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

server.on("/onled1", []() {
  server.send(200, "text/plain", "Motor ligado");
  digitalWrite(motor, LOW);  // Inverte a lógica aqui
  isMotorOn = true; // Atualiza o status do motor
});

server.on("/offled1", []() {
  server.send(200, "text/plain", "Motor desligado");
  digitalWrite(motor, HIGH); // Inverte a lógica aqui
  isMotorOn = false; // Atualiza o status do motor
});

  server.on("/umidade", []() {
    int valorUmidade = analogRead(umid);
    String response = String(valorUmidade) + "," + (isMotorOn ? "1" : "0"); // Adicione o estado atual do motor à resposta
    server.send(200, "text/plain", response);
    delay(1000);
  });
server.on("/api/devices", HTTP_POST, []() {
  if (server.hasArg("plain")) {
    String json = server.arg("plain");
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, json);

    if (error) {
      server.send(400, "text/plain", "Erro ao processar o JSON");
    } else {
      bool motorStatus = doc["motorStatus"];
      int umidade = doc["umidade"];

      // Realize as ações com os dados recebidos
      if (motorStatus) {
        digitalWrite(motor, LOW); // Ligar o motor
        isMotorOn = true;
      } else {
        digitalWrite(motor, HIGH); // Desligar o motor
        isMotorOn = false;
      }

      server.send(200, "text/plain", "JSON recebido com sucesso");
    }
  } else {
    server.send(400, "text/plain", "Nenhum JSON encontrado");
  }
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
