// Play audio
const PlaySound = (soundobj) => {
  var thissound = document.getElementById(soundobj);
  thissound.play();
};

// Stop audio
const StopSound = (soundobj) => {
  var thissound = document.getElementById(soundobj);
  thissound.pause();
  thissound.currentTime = 0;
};

/* PDF render */
const url = '../docs/english/english-1-20.pdf';

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 0.8,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

// Render the page
const renderPage = (num) => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then((page) => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });
  });

  // Output current page
  document.querySelector('#page-num').textContent = num;
};

// Check for pages rendering
const queueRenderPage = (num) => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  setAudioAttribute();
  queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  setAudioAttribute();
  queueRenderPage(pageNum);
};

const setAudioAttribute = () => {
  // const pageAudioId = document.querySelector('#speak-btn');
  const onhover = document.querySelector('.onhover');

  // pageAudioId.setAttribute('onmouseover', `PlaySound('eng-${pageNum}')`);
  // pageAudioId.setAttribute('onmouseout', `StopSound('eng-${pageNum}')`);
  onhover.setAttribute('onmouseover', `PlaySound('eng-${pageNum}')`);
  onhover.setAttribute('onmouseout', `StopSound('eng-${pageNum}')`);
};
setAudioAttribute();

// const spaceStartStop = () => {
//   const pageAudioId = document.querySelector('#speak-btn');
//   pageAudioId.setAttribute('onmouseover', ``);
//   pageAudioId.setAttribute('onmouseout', ``);
// };

// Keyevents
const keyEvent = (event) => {
  if (event.keyCode === 37) {
    showPrevPage();
  } else if (event.keyCode === 39) {
    showNextPage();
  } else if (event.keyCode === 32) {
    // spaceStartStop();
  } else {
    return null;
  }
};

// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch((err) => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document
  .querySelector('#prev-page-btn')
  .addEventListener('click', showPrevPage);

document
  .querySelector('#next-page-btn')
  .addEventListener('click', showNextPage);

document.addEventListener('keydown', keyEvent);
