import os
from fastapi import UploadFile
import aiofiles
import uuid

async def save_upload_file(uploaded_file: UploadFile) -> str:
    """
    Asynchronously saves an uploaded file to a local temporary directory 
    in chunks and returns the file path.
    """
    
    # 1. Setup Directory
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    
    # 2. Create a unique filename - Using a UUID prevents name collisions and improves security
    file_extension = os.path.splitext(uploaded_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(temp_dir, unique_filename)

    # 3. Write file in binary chunks (Non-blocking I/O)
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            # Read and write chunks to prevent loading huge files into memory - 1024 * 1024 bytes (1MB) is a good chunk size
            while content := await uploaded_file.read(1024 * 1024):
                await out_file.write(content)
        
        # 4. Return the path
        return file_path
        
    except Exception as e:
        print(f"Error saving file: {e}")
        # Clean up the file if an error occurred during writing
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    
    finally:
        # Always close the UploadFile object
        await uploaded_file.close()