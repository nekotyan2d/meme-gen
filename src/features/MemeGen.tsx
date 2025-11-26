import { useRef, useState } from "react";
import "./MemeGen.css";

function MemeGen() {
    const memeRef = useRef<HTMLDivElement>(null);
    function onImageUpload() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    setImage(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    }

    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState<string>("");

    function memeImage() {
        if (!image) return null;

        return (
            <img
                src={image}
                alt="Meme"
                className="meme-image"
                style={{ maxWidth: "100%" }}
            />
        );
    }

    function downloadMeme() {
        if (!memeRef.current) return;

        const memeElement = memeRef.current;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        const { width, height } = memeElement.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        const imageElement = memeElement.querySelector("img");
        if (imageElement) {
            context.drawImage(imageElement, 0, 0, width, height);
        }

        context.font = "48px Lobster";
        context.fillStyle = "white";
        context.shadowOffsetX = -1;
        context.shadowOffsetY = 2;
        context.shadowBlur = 2;
        context.shadowColor = "black";
        context.textAlign = "center";
        context.fillText(text, width / 2, height - 20);

        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    function downloadButton() {
        if (!image) return null;

        return <button onClick={downloadMeme}>Сохранить</button>;
    }

    return (
        <div className="meme-generator">
            <h1>Meme Generator</h1>
            <button onClick={onImageUpload}>Загрузить изображение</button>
            <div
                className="meme-layout"
                ref={memeRef}>
                {memeImage()}
                <input
                    value={text}
                    className="meme-text"
                    onChange={(e) => setText(e.target.value)}></input>
            </div>

            {downloadButton()}
        </div>
    );
}

export default MemeGen;
