# Figma Links & Brand Asset Repository

BuyOut relies on a sleek, modern, dark-mode native design language. All source files for logos, icons, and UI components are mastered in Figma before being implemented via NativeWind/Gluestack.

## Figma Workspaces
*(Links to be inserted by Product Owner)*
*   **Core UI Kit:** [Link to Core UI Kit]
*   **App Screens:** [Link to App Screens Flow]
*   **Marketing Assets:** [Link to Social Banners / App Store Screenshots]

## Brand Colors (Hex Codes)
Our brand identity relies on a specific set of tailored variables configured in our `tailwind.config.js`.

*   **Background (Primary):** `#1A1D21` (Deep Charcoal Black)
*   **Background (Surface):** `#2A2D32` (Elevated Card Color)
*   **Accent (Primary):** `#3B82F6` (Electric Blue - Used for primary CTAs like 'Apply', 'Next')
*   **Accent (Success):** `#10B981` (Emerald Green - Used for showing 'Savings' or 'Approval')
*   **Text (Primary):** `#FFFFFF` (White)
*   **Text (Secondary):** `#9CA3AF` (Cool Gray - Used for subtitles and non-essential numbers)

## Logo & Typography
*   **Logo Treatment:** The BuyOut logo is purely typographic. It uses `Inter-Bold` in stark `#FFFFFF`.
*   **Typography:** The entire application utilizes the **Inter** font family by Google. We use `Inter-Regular`, `Inter-Medium`, and `Inter-Bold`.
    *   *Do NOT use system default fonts on iOS or Android to ensure brand consistency.*

## Exporting Assets from Figma
When an engineer requires an icon (e.g., a specific Bank Logo):
1.  Export the asset from Figma specifically as an **SVG**.
2.  Do NOT use PNGs or JPEGs inside the app bundle due to scaling issues on different Retina displays.
3.  Place the SVG using `react-native-svg` if it requires dynamic coloring, or directly into the Expo `/assets` folder.
