from PIL import Image, ImageDraw

def create_icon(size, filename):
    # Create a new image with a blue background
    img = Image.new('RGB', (size, size), color='#0d6efd')
    draw = ImageDraw.Draw(img)
    
    # Draw a white cross
    padding = size // 4
    thickness = size // 6
    
    # Vertical bar
    draw.rectangle([
        (size // 2 - thickness // 2, padding),
        (size // 2 + thickness // 2, size - padding)
    ], fill='white')
    
    # Horizontal bar
    draw.rectangle([
        (padding, size // 2 - thickness // 2),
        (size - padding, size // 2 + thickness // 2)
    ], fill='white')
    
    img.save(filename)
    print(f"Created {filename}")

if __name__ == "__main__":
    import os
    public_dir = os.path.join("frontend", "public")
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
        
    create_icon(192, os.path.join(public_dir, "pwa-192x192.png"))
    create_icon(512, os.path.join(public_dir, "pwa-512x512.png"))
