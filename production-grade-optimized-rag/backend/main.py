from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origin=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):
    path = f"uploads/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    

    return {"status": "uploaded"}