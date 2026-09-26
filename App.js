import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import { TextInput, Card, Text, Button, FAB, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const searchInputRef = useRef(null);
  const productsRef = useRef([]);

  useEffect(() => {
    // Lazy load products on app start
    setTimeout(() => {
      try {
        const PRODUCTS_DATA = require('./products.json');
        productsRef.current = PRODUCTS_DATA;
        setAppReady(true);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to load products: ' + error.message);
        setLoading(false);
      }
    }, 100);
  }, []);

  // Enhanced search logic - searches across code, name, and weights differently
  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const query = text.toLowerCase().trim();

    // Scoring system for better matches
    const scored = productsRef.current.map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const code = product.code.toLowerCase();
      
      // Exact match gets highest score
      if (name === query || code === query) score += 1000;
      
      // Start of string matches
      if (name.startsWith(query)) score += 500;
      if (code.startsWith(query)) score += 300;
      
      // Word boundary matches
      const words = name.split(/[\s/,.-]+/);
      words.forEach(word => {
        if (word.startsWith(query)) score += 200;
      });
      
      // Contains the query
      if (name.includes(query)) score += 50;
      if (code.includes(query)) score += 30;
      
      return { ...product, score };
    }).filter(p => p.score > 0);

    // Sort by score and limit to 15 results
    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    setSuggestions(sorted);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchText('');
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product first');
      return;
    }

    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }

    const newItem = {
      id: `${selectedProduct.code}-${Date.now()}`,
      ...selectedProduct,
      quantity: qty,
      subtotal: selectedProduct.price * qty,
    };

    setCartItems([...cartItems, newItem]);
    setSelectedProduct(null);
    setQuantity('1');
    setSearchText('');
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Clear',
        onPress: () => {
          setCartItems([]);
          setSelectedProduct(null);
        },
        style: 'destructive',
      },
    ]);
  };

  // Calculate total whenever cart changes
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    setCartTotal(total);
  }, [cartItems]);

  const SuggestionItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.suggestionItem}>
      <View>
        <Text style={styles.suggestionName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.suggestionCode}>
          Code: {item.code}
        </Text>
      </View>
      <Text style={styles.suggestionPrice}>₹{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const CartItem = ({ item, onRemove }) => (
    <Card style={styles.cartItem}>
      <Card.Content>
        <View style={styles.cartItemHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cartItemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.cartItemCode}>{item.code}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            style={styles.removeButton}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
        <View style={styles.cartItemFooter}>
          <Text>
            {item.quantity.toFixed(2)} × ₹{item.price.toFixed(2)}
          </Text>
          <Text style={styles.cartItemSubtotal}>
            ₹{item.subtotal.toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name="shopping" size={80} color="#6200ee" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#333' }}>Loading ShopPOS...</Text>
        <Text style={{ marginTop: 8, fontSize: 12, color: '#999' }}>27,004 products loading</Text>
        <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />

      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="store" size={28} color="white" />
        <Text style={styles.headerTitle}>ShopPOS</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search by product name, code..."
            value={searchText}
            onChangeText={handleSearch}
            left={<TextInput.Icon icon="magnify" />}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="#6200ee"
          />
          
          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              renderItem={({ item }) => (
                <SuggestionItem
                  item={item}
                  onPress={handleSelectProduct}
                />
              )}
              keyExtractor={(item, idx) => `${item.code}-${idx}`}
              scrollEnabled={false}
              style={styles.suggestionsList}
            />
          )}
        </View>

        {/* Selected Product Section */}
        {selectedProduct && (
          <Card style={styles.selectedCard}>
            <Card.Content>
              <Text style={styles.selectedLabel}>Selected Product</Text>
              <Text style={styles.selectedName}>{selectedProduct.name}</Text>
              <Text style={styles.selectedCode}>Code: {selectedProduct.code}</Text>
              <Text style={styles.selectedPrice}>
                Price: ₹{selectedProduct.price.toFixed(2)}
              </Text>

              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityInput}>
                  <TouchableOpacity
                    onPress={() =>
                      setQuantity(Math.max(0.5, parseFloat(quantity) - 1).toString())
                    }
                    style={styles.quantityBtn}
                  >
                    <Text style={styles.quantityBtnText}>−</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityField}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="decimal-pad"
                    mode="outlined"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setQuantity((parseFloat(quantity) + 1).toString())
                    }
                    style={styles.quantityBtn}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleAddToCart}
                style={styles.addButton}
                contentStyle={{ paddingVertical: 8 }}
                icon="plus-circle"
              >
                Add to Cart (₹{(selectedProduct.price * (parseFloat(quantity) || 1)).toFixed(2)})
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  setSelectedProduct(null);
                  setQuantity('1');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Cart Section */}
        {cartItems.length > 0 && (
          <View style={styles.cartSection}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>
                Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </Text>
              <Button
                mode="text"
                onPress={handleClearCart}
                textColor="#ff6b6b"
              >
                Clear
              </Button>
            </View>

            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onRemove={handleRemoveFromCart}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.cartList}
            />

            {/* Cart Total */}
            <Card style={styles.totalCard}>
              <Card.Content>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>₹{cartTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax (0%)</Text>
                  <Text style={styles.totalValue}>₹0.00</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotal]}>
                  <Text style={styles.grandTotalLabel}>Total</Text>
                  <Text style={styles.grandTotalValue}>₹{cartTotal.toFixed(2)}</Text>
                </View>

                <Button
                  mode="contained"
                  onPress={() => setModalVisible(true)}
                  style={styles.checkoutButton}
                  contentStyle={{ paddingVertical: 10 }}
                >
                  Proceed to Checkout
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Empty State */}
        {cartItems.length === 0 && !selectedProduct && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="shopping" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              Search for products to get started
            </Text>
          </View>
        )}
      </View>

      {/* Checkout Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Content>
              <Text style={styles.modalTitle}>Order Summary</Text>
              
              <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                  <View style={styles.modalItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemQty}>
                        {item.quantity.toFixed(2)} × ₹{item.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.modalItemTotal}>
                      ₹{item.subtotal.toFixed(2)}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
                )}
              />

              <View style={styles.modalDivider} />
              
              <View style={styles.modalTotalRow}>
                <Text style={styles.modalTotalLabel}>Total Amount</Text>
                <Text style={styles.modalTotalAmount}>₹{cartTotal.toFixed(2)}</Text>
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  Alert.alert(
                    'Order Confirmed!',
                    `Order total: ₹${cartTotal.toFixed(2)}`,
                    [
                      {
                        text: 'New Order',
                        onPress: () => {
                          setCartItems([]);
                          setModalVisible(false);
                        },
                      },
                    ]
                  );
                }}
                style={styles.confirmButton}
                contentStyle={{ paddingVertical: 10 }}
              >
                Confirm Order
              </Button>

              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelModalButton}
              >
                Continue Shopping
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  searchSection: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: 'white',
  },
  suggestionsList: {
    backgroundColor: 'white',
    marginTop: 4,
    borderRadius: 4,
    maxHeight: 250,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  suggestionCode: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  selectedCard: {
    marginBottom: 12,
    backgroundColor: '#f0f4ff',
    elevation: 2,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  selectedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  selectedCode: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 6,
  },
  quantitySection: {
    marginTop: 12,
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  quantityInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityField: {
    flex: 1,
    height: 40,
  },
  addButton: {
    marginBottom: 8,
  },
  cancelButton: {
    borderColor: '#ddd',
  },
  cartSection: {
    marginBottom: 12,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cartList: {
    marginBottom: 8,
  },
  cartItem: {
    marginBottom: 8,
    elevation: 1,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  cartItemCode: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  removeButton: {
    marginLeft: 8,
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartItemSubtotal: {
    fontWeight: 'bold',
    color: '#6200ee',
    fontSize: 13,
  },
  totalCard: {
    backgroundColor: '#f0f4ff',
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 13,
    color: '#666',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#6200ee',
    marginTop: 8,
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  checkoutButton: {
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  modal: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  modalItemQty: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  modalItemTotal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  modalDivider: {
    height: 2,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modalTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  confirmButton: {
    marginBottom: 8,
  },
  cancelModalButton: {
    borderColor: '#ddd',
  },
});
