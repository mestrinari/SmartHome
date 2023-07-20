import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const serverIP = 'http://192.168.1.100';

export default function App() {
  const autoRefreshInterval = useRef(null);
  const [isEnable, setIsEnable] = useState(true);
  const [isMotorOn, setIsMotorOn] = useState(true);
  const [umi, setUmi] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [manualMotorOn, setManualMotorOn] = useState(false);

  const startAutoRefresh = () => {
    autoRefreshInterval.current = setInterval(() => {
      fetchUmidade();
    }, 6000);
  };

  useEffect(() => {
    startAutoRefresh();
    return () => {
      clearInterval(autoRefreshInterval.current);
    };
  }, []);

  const isSwitch = (value) => {
    setIsEnable(value);
    if (isConnected) {
      const quartoState = value ? 'on' : 'off';
      axios
        .get(`${serverIP}/${quartoState}red`)
        .then((response) => {
          console.log(`Quarto ${quartoState}`);
        })
        .catch((error) => {
          console.log('Erro ao controlar o quarto:', error);
          setIsEnable(!value);
        });
    }
  };

  const toggleMotor = () => {
    if (isConnected) {
      if (isMotorOn || manualMotorOn) {
        setIsMotorOn(false);
        setManualMotorOn(false);
        console.log('Desligando o motor');
      } else {
        setIsMotorOn(true);
        setManualMotorOn(true);
        console.log('Ligando o motor');
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      const motorState = isMotorOn || manualMotorOn ? 'on' : 'off';
      const motorEndpoint = manualMotorOn ? `${serverIP}/${motorState}led1` : `${serverIP}/${motorState}led2`;
      axios
        .get(motorEndpoint)
        .then((response) => {
          console.log(`Motor ${motorState}`);
        })
        .catch((error) => {
          console.log('Erro ao controlar o motor:', error);
        });
    }
  }, [isMotorOn, manualMotorOn]);

  const fetchUmidade = () => {
    axios
      .get(`${serverIP}/umidade`)
      .then((response) => {
        const data = response.data.split(',');
        const umidade = parseInt(data[0], 10);
        setUmi(umidade);
        setIsConnected(true);
        console.log('Dados recuperados com sucesso');

        if (umidade > 950) {
          if (!isMotorOn) {
            setIsMotorOn(true);
            console.log('Ligando o motor');
          }
        } else if (umidade < 450) {
          if (isMotorOn) {
            setIsMotorOn(false);
            console.log('Desligando o motor');
          }
        }
      })
      .catch((error) => {
        console.log('Erro ao recuperar os dados de umidade:', error);
        setIsConnected(false);
      });
  };

  let containerStyle = styles.containerGreen;
  if (umi > 800) {
    containerStyle = styles.containerRed;
  } else if (umi > 400) {
    containerStyle = styles.containerYellow;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ marginTop: 200 }}>
        <Text style={isEnable ? styles.ON : styles.OFF}>
          Quarto {isEnable ? 'ligado' : 'desligado'}
        </Text>
        <Switch onValueChange={(value) => isSwitch(value)} value={isEnable} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Motor</Text>
        <Switch
          trackColor={{ false: 'red', true: 'green' }}
          thumbColor={isMotorOn || manualMotorOn ? 'white' : 'white'}
          onValueChange={toggleMotor}
          value={isMotorOn || manualMotorOn}
        />
      </View>

      {!isConnected && (
        <Text style={styles.connectionErrorText}>
          Erro de conexão. Verifique sua conexão com o servidor.
        </Text>
      )}

      <View>
        <Text>Medida: {umi !== null ? umi : '-'}</Text>
        <View>
          <TouchableOpacity onPress={fetchUmidade}>
            <MaterialIcons name="sync" size={45} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerGreen: {
    backgroundColor: 'green',
  },
  containerRed: {
    backgroundColor: 'red',
  },
  containerYellow: {
    backgroundColor: 'yellow',
  },
  ON: {
    color: 'black',
  },
  OFF: {
    color: 'black',
  },
  connectionErrorText: {
    color: 'red',
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 18,
  },
});
