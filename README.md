# ShopPOS - Mobile POS System

A beautiful, fast, and user-friendly mobile POS application built with React Native and Expo. Perfect for shop owners who need a quick way to enter products and manage sales.

## Features ✨

✅ **Smart Product Search** - Search by product code, name, or company name with intelligent scoring
✅ **Auto-Price Population** - Prices auto-fill when you select a product
✅ **Live Suggestions** - Real-time product suggestions as you type (top 15 matches)
✅ **Add to Cart** - Easy quantity adjustment with +/- buttons
✅ **Cart Management** - View all items, remove items, clear entire cart
✅ **Order Summary** - Modal checkout with order confirmation
✅ **Beautiful UI** - Modern Material Design with purple theme
✅ **27,000+ Products** - Pre-loaded with your shop's product database
✅ **No Server Needed** - Completely offline-first

## Search Algorithm 🔍

The app uses an intelligent scoring system to rank search results:
- **1000 points** - Exact match
- **500 points** - Product name starts with query
- **300 points** - Product code starts with query  
- **200 points** - Any word in product name starts with query
- **50 points** - Product name contains query
- **30 points** - Product code contains query

Results are sorted by score and limited to top 15 matches for performance.

## UI Highlights 🎨

- **Header** - Purple branded header with app logo
- **Search Bar** - Prominent search with magnifying glass icon
- **Suggestions Dropdown** - Live suggestions with product code and price
- **Product Card** - Shows selected product with quantity controls
- **Cart Display** - All cart items with remove buttons
- **Total Card** - Subtotal, tax, and grand total
- **Checkout Modal** - Order summary before confirmation

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your Android phone (for testing) OR
- Android Studio for building APK

### Option 1: Quick Test (Expo Go App)

1. Extract the ShopPOS folder
2. Navigate to the folder:
   ```bash
   cd ShopPOS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm start
   ```
5. In the terminal, press `a` for Android
6. Install Expo Go from Google Play on your Android phone
7. Scan the QR code shown in terminal with Expo Go

### Option 2: Build APK for Installation

#### Using EAS (Easiest - Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```
   (Create free account at https://expo.dev if you don't have one)

3. Build APK:
   ```bash
   cd ShopPOS
   eas build --platform android --local
   ```

4. Download the generated APK from the link provided
5. Transfer to your Android phone and install

#### Using Local Build (Without EAS Account)

```bash
cd ShopPOS
npm install
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## How to Use

1. **Search** - Type in the search bar to find products
   - Try searching by product code (e.g., "N0027116")
   - Or by product name (e.g., "MUTTON", "FRESH")
   - Or by description parts (e.g., "BEEF /KG")

2. **Select Product** - Tap on any suggestion to select it

3. **Adjust Quantity** - Use +/- buttons or type directly in the quantity field

4. **Add to Cart** - Press "Add to Cart" button

5. **Manage Cart** 
   - View all items with quantities and subtotals
   - Remove individual items by tapping the X icon
   - Clear all with the Clear button

6. **Checkout** - Press "Proceed to Checkout" to see order summary and confirm

## Customization

### Change App Color
Open `App.js` and find `#6200ee` (purple) and replace with your color:
```javascript
const PRIMARY_COLOR = '#FF6B00'; // Your color here
```

### Update Products
Replace `products.json` with your product data. Format:
```json
[
  {
    "code": "PRODUCT_CODE",
    "name": "Product Name and Description",
    "price": 19.99
  }
]
```

### Add Tax/Discount
In the checkout modal, modify this section:
```javascript
<Text style={styles.totalLabel}>Tax (add % here)</Text>
<Text style={styles.totalValue}>₹{cartTotal * 0.05}</Text> // 5% tax example
```

## Troubleshooting

**App crashes on startup?**
- Clear cache: `npm start -- --clear`
- Delete node_modules: `rm -rf node_modules && npm install`

**Can't find products?**
- Ensure products.json exists in the app folder
- Check JSON format is correct

**APK too large?**
- Normal for React Native app (~100MB)
- You can compress after building

**Need offline mode?**
- App works completely offline!
- All products are embedded in the app

## File Structure

```
ShopPOS/
├── App.js              # Main app component
├── app.json            # Expo configuration
├── package.json        # Dependencies
├── products.json       # Your product database (27K+ items)
├── README.md          # This file
└── android/           # Generated Android native code
```

## Performance Notes

- Search is optimized to show top 15 results instantly
- 27K products load seamlessly
- Minimal memory footprint
- Smooth scrolling and animations

## Support

For issues or feature requests, check:
- Expo documentation: https://docs.expo.dev
- React Native docs: https://reactnative.dev

## License

Built for your shop. Feel free to modify and distribute as needed!

---

**Version:** 1.0.0  
**Built with:** React Native + Expo  
**Last Updated:** 2026-09-26
