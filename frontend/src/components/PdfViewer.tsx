import { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { useRef } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfViewer = ({ fileUrl, onTextSelect }: { fileUrl: string, onTextSelect: (text: string) => void }) => {
    const pdfViewerRef = useRef(null);

    const handleTextSelect = () => {
        const selectedText = window.getSelection()?.toString();
        if (selectedText) {
            onTextSelect(selectedText);
        }
    };

    return (
        <div className="pdf-container">
            <button onClick={handleTextSelect}>Explain</button>
            <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js`}>
                <Viewer fileUrl={fileUrl} ref={pdfViewerRef} />
            </Worker>
        </div>
    );
};

export default PdfViewer;
