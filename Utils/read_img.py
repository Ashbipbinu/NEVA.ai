import os
import uuid
import base64

async def save_upload_file(img_base64: str) -> str:
    """
    Converts a Base64 string to a temporary file and returns the file path.
    """

    # 1. Remove prefix if present
    if "," in img_base64:
        img_base64 = img_base64.split(",")[1]

    # 2. Decode Base64
    try:
        img_bytes = base64.b64decode(img_base64)
    except Exception as e:
        raise ValueError(f"Failed to decode Base64 image: {e}")

    # 3. Save to temp folder
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}.png"  # always save as PNG
    file_path = os.path.join(temp_dir, unique_filename)

    try:
        with open(file_path, "wb") as f:
            f.write(img_bytes)
        return file_path
    except Exception as e:
        raise IOError(f"Failed to save image: {e}")
