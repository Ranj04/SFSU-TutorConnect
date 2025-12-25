"""
Script to make the background of sfsu_logo.png transparent
Removes green background and preserves the gator colors
"""

from PIL import Image
import numpy as np

def make_background_transparent(input_path, output_path, bg_color_rgb=(118, 188, 77), tolerance=30):
    """
    Make background transparent for an image with a solid color background.
    
    Args:
        input_path: Path to input image
        output_path: Path to save transparent image
        bg_color_rgb: RGB tuple of background color to remove
        tolerance: How similar colors need to be to background to be made transparent
    """
    # Load the image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Convert to numpy array for easier manipulation
    data = np.array(img)
    
    # Get RGB channels
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Calculate color difference from background
    bg_r, bg_g, bg_b = bg_color_rgb
    color_diff = np.sqrt(
        (r.astype(float) - bg_r)**2 + 
        (g.astype(float) - bg_g)**2 + 
        (b.astype(float) - bg_b)**2
    )
    
    # Create transparency mask
    # Pixels similar to background become transparent
    # Use smooth alpha transition for anti-aliasing
    alpha_channel = np.where(
        color_diff < tolerance,
        0,  # Fully transparent for background
        np.where(
            color_diff < tolerance * 2,
            ((color_diff - tolerance) / tolerance * 255).astype(np.uint8),  # Smooth transition
            255  # Fully opaque for foreground
        )
    )
    
    # Apply the new alpha channel
    data[:, :, 3] = alpha_channel
    
    # Convert back to image
    result = Image.fromarray(data)
    
    # Save as PNG
    result.save(output_path, 'PNG')
    print(f"Saved transparent image to: {output_path}")
    
    return result

if __name__ == "__main__":
    # Process the SFSU logo
    input_file = "sfsu_logo.png"
    output_file = "sfsu_logo_transparent.png"
    
    # Try different background colors (green shades commonly used)
    # Adjust these RGB values based on your actual background color
    possible_bg_colors = [
        (118, 188, 77),   # Common green
        (255, 255, 255),  # White
        (240, 240, 240),  # Light gray
    ]
    
    print("Processing SFSU logo to make background transparent...")
    print(f"Input: {input_file}")
    print(f"Output: {output_file}")
    
    # Try with the first background color
    try:
        make_background_transparent(
            input_file, 
            output_file,
            bg_color_rgb=possible_bg_colors[1],  # Start with white
            tolerance=40  # Adjust if needed
        )
        print("✓ Success! Background removed.")
        print("\nIf the background isn't fully removed, try adjusting:")
        print("  - bg_color_rgb: Change the RGB values to match your background")
        print("  - tolerance: Increase to remove more, decrease for precision")
    except FileNotFoundError:
        print(f"Error: Could not find {input_file}")
        print("Make sure the file exists in the same directory as this script.")
    except Exception as e:
        print(f"Error: {e}")

