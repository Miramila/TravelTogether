import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, addBudget, deleteBudget, setExpectedCost } from '../features/budgetSlice';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const WalletScreen = () => {
  const dispatch = useDispatch();
  const { items, totalSpent, expectedCost } = useSelector((state) => state.budget);

  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [expected, setExpected] = useState('');

  // Fetch budget data when component mounts
  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);

  const handleAddItem = () => {
    if (!itemName || !itemCost) return;
    const newItem = {
      id: `${Date.now()}`, // temporary unique ID
      name: itemName,
      cost: parseFloat(itemCost),
    };
    dispatch(addBudget(newItem));
    setItemName('');
    setItemCost('');
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteBudget(id));
  };

  const handleSetExpectedCost = () => {
    if (!expected) return;
    dispatch(setExpectedCost(parseFloat(expected)));
    setExpected('');
  };

  return (
    <View style={styles.container}>

      {/* Input for adding items */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Cost"
          value={itemCost}
          keyboardType="numeric"
          onChangeText={setItemCost}
        />
        <Button title="Add" onPress={handleAddItem} style={styles.button}/>
      </View>

      {/* List of items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name}: ${item.cost}
            </Text>
            <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
          </View>
        )}
      />

      {/* Set expected cost */}
      <View style={styles.expectedContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expected Cost"
          value={expected}
          keyboardType="numeric"
          onChangeText={setExpected}
        />
        <Button title="Set Expected" onPress={handleSetExpectedCost} />
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Expected Cost: ${expectedCost}</Text>
        <Text style={styles.summaryText}>Total Spent: ${totalSpent}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    width: '60%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 5,
    borderRadius: 5,
    flexShrink: 1,
  },
  button: {
    width: 80,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  expectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  summary: {
    marginTop: 30,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default WalletScreen;