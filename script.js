import * as pdfjsLib from "./js/pdf.mjs";
import "./js/turn.min.js";

const url = "book.pdf";

const flipbook = document.getElementById("flipbook");
pdfjsLib.GlobalWorkerOptions.workerSrc = "./js/pdf.worker.mjs";
pdfjsLib
  .getDocument(url)
  .promise.then((pdf) => {
    const numPages = pdf.numPages;
    let pagesRendered = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const pageContainer = document.createElement("div");
      pageContainer.className = "page";
      pageContainer.id = `page-${pageNum}`;
      flipbook.appendChild(pageContainer);

      pdf.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext).promise.then(() => {
          pageContainer.appendChild(canvas);
          pagesRendered++;

          if (pagesRendered === numPages) {
            $("#flipbook").turn({
              width: 800,
              height: 600,
              autoCenter: true,
            });
          }
        });
      });
    }
  })
  .catch((error) => {
    console.error("Error loading PDF:", error);
  });
