import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import styles from '../style/style';

let board = [];  
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;

let pbuttons = [];
const POINT_BUTTONS = 6;
  for (let i = 0; i < POINT_BUTTONS; i++) {
    pbuttons.push({
      id: i,
      sum: 0,
      icon: 'numeric-' + [i + 1] + '-circle'
    })
  }

export default function Gameboard() {
  const [turn, setTurn] = useState(0);
  const [throwsLeft, setThrowsleft] = useState(NBR_OF_THROWS);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [pointStatus, setPointStatus] = useState('');
  const [selectedDices, setSelectedDices] =
    useState(new Array(NBR_OF_DICES).fill(false));
  const [selectedPoints, setSelectedPoints] =
    useState(pbuttons);

  useEffect(() => {
    if (turn === 0) {
      setStatus('Game has not started yet')
    } 
    if (throwsLeft === 0) {
      let dices = [...selectedDices];
      dices.fill(false);
      setSelectedDices(dices);
      setStatus('Select points to keep')
    } 
    if (throwsLeft < 0) {
      setThrowsleft(NBR_OF_THROWS-1);
    }
  }, [throwsLeft]);

  useEffect(() => {
    let bonus = 63 - total;
    if (bonus <= 0) {
      setPointStatus('Bonus achieved')
    } else {
      setPointStatus('You are ' + bonus + ' points away from bonus')
    }
  });

  function throwDices() {
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
      }
    }
    setTurn(turn+1);
    setThrowsleft(throwsLeft-1);
    setStatus('Keep playing')
  }
  
  function selectDice(i) {
    if (throwsLeft === 0) {
      setStatus('Select points to keep')
      return;
    } else if (throwsLeft === 3) {
      setStatus('Throw the first throw')
      return;
    }
    let dices = [...selectedDices];
    dices[i] = selectedDices[i] ? false : true;
    setSelectedDices(dices);
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "black" : "steelblue";
  }

  function pointIndex(i) {
    let index = selectedPoints.findIndex((item => item.id === i));
    return index;
  }

  function selectPoint(i) {
    if (throwsLeft > 0) {
      setStatus('Throw first')
      return;
    }
    let points = [...selectedPoints];
    let index = pointIndex(i);
    if (points[index]['selected'] === true) {
      return;
    } else {
      points[index]['selected'] === true;
      setThrowsleft(NBR_OF_THROWS);

      let totalPoints = board.map(item => item.slice(5,7));
      let count = totalPoints.filter(x => x == (index+1)).length;
      let sum = count * (index + 1);
      points[index]['sum'] = sum;
      points[index]['locked'] = true;
      setSelectedPoints(points);
      setTotal(total + sum);
    }
  }

  function sumText(i) {
    return selectedPoints[i]['sum'];
  }

  function pointColor(i) {
    let index = pointIndex(i);
    if (selectedPoints[index]['selected'] === true) {
      return 'black';
    } else {
      return 'steelblue';
    }
  }

  function pointIcon(i) {
    let index = pointIndex(i);
    let returnIcon = selectedPoints[index]['icon'];
    return returnIcon;
  }

  const row = [];
  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Pressable
        onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          key={"row" + i}
          size={50}
          color={getDiceColor(i)}>
        </MaterialCommunityIcons>
      </Pressable>
    );
  }

  const points = [];
  for (let i = 0; i < pbuttons.length; i++) {
    points.push(
      <View>
        <Text>{sumText(i)}</Text>
        <Pressable
          onPress={() => selectPoint(i)}>
          <MaterialCommunityIcons
            name={pointIcon(i)}
            key={"points" + i}
            size={50}
            color={pointColor(i)}>
          </MaterialCommunityIcons>
        </Pressable>
      </View>
    );
  }

  
  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}>Throws left: {throwsLeft}</Text>
      <Text style={styles.gameinfo}>Status: {status}</Text>
      <Pressable style={styles.button}
        disabled={throwsLeft === 0 ? true : false}
        onPress={() => throwDices()}>
        <Text style={styles.buttonText}>Throw dices</Text>
      </Pressable>
      <Text style={styles.gameinfo}>Total: {total}</Text>
      <Text style={styles.gameinfo}>{pointStatus}</Text>
      <Text style={styles.gameinfo}>{points}</Text>
    </View>
  )
}


