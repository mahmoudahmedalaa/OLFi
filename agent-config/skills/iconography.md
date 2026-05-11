---
description: 'How to fetch and insert icons into the project using the Lucide API'
---
# Iconography Skill

OLFi relies on high-quality SVG icons. To streamline development and avoid manual downloads, use the `fetch-icon.js` script to pull icons directly from the Lucide open-source library.

## Usage

When you need an icon (e.g., a 'home' icon or a 'chevron-right' icon), run the following command from the root of the project:

```bash
node 02-agent/scripts/fetch-icon.js <icon-name> <destination-directory>
```

### Example:

To fetch the 'user' icon and place it in the `app/assets/images` directory:

```bash
node 02-agent/scripts/fetch-icon.js user app/assets/images
```

## How it works:
1.  The script queries the Lucide API (or equivalent raw GitHub content) for the specified `icon-name`.
2.  If found, it downloads the raw SVG string.
3.  It saves the `.svg` file into the target directory you specified.

## Important Notes:
*   Ensure the icon name matches Lucide's naming conventions (kebab-case, e.g., `arrow-right`, `credit-card`). You can usually guess these or search the web for Lucide icon names.
*   For React Native, remember that you need a library like `react-native-svg` to render these files, or you can use Expo's built-in `@expo/vector-icons` if the icon exists there. This script is primarily for when you need the raw SVG asset for custom styling or usage that vector-icons doesn't support.
