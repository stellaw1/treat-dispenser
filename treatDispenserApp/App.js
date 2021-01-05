/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createGoal } from './graphql/mutations'
import { listGoals } from './graphql/queries'

import config from './aws-exports'
Amplify.configure(config)

const initialState = { name: '', description: '', targetValue: '' }

const App: () => React$Node = () => {
  const [formState, setFormState] = useState(initialState)
  const [goals, setGoals] = useState([])

  useEffect(() => {
    fetchGoals()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchGoals() {
    try {
      const goalData = await API.graphql(graphqlOperation(listGoals))
      const goals = goalData.data.listGoals.items
      setGoals(goals)
    } catch (err) { console.log('error fetching goals') }
  }

  async function addGoal() {
    try {
      const goal = { ...formState }
      setGoals([...goals, goal])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createGoal, { input: goal }))
    } catch (err) {
      console.log('error creating goal:', err)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Create Goal</Text>
              <View style={styles.form}>
                <TextInput
                  onChangeText={val => setInput('name', val)}
                  style={styles.input}
                  value={formState.name}
                  placeholder="Name"
                />
                <TextInput
                  onChangeText={val => setInput('description', val)}
                  style={styles.input}
                  value={formState.description}
                  placeholder="Description"
                />
                <TextInput
                  onChangeText={val => setInput('targetValue', val)}
                  style={styles.input}
                  value={formState.targetValue}
                  keyboardType="numeric"
                  placeholder="Target Value"
                />
                <Button title="Create Goal" onPress={addGoal} />
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Goals</Text>
              <Text style={styles.sectionDescription}>
                {
                  goals.map((goal, index) => (
                    <View key={goal.id ? goal.id : index} style={styles.goal}>
                      <Text style={goal.todoName}>{goal.name}</Text>
                      <Text>{goal.description}</Text>
                    </View>
                  ))
                }
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  form: { flex: 1, justifyContent: 'center', padding: 20 },
  goal: { marginBottom: 15 },
  input: { height: 50, marginBottom: 10, padding: 8 },
  goalName: { fontSize: 18 }
});

export default App;
