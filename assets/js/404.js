$(document).ready(function () {
   $('#menu').click(function () {
       $(this).toggleClass('fa-times');
       $('.navbar').toggleClass('nav-toggle');
   });
});

// Disable developer mode
document.onkeydown = function (e) {
   if (e.code === 'F12') { // F12 for Developer Tools
       e.preventDefault();
       return false;
   }
   if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') { // Ctrl+Shift+I
       e.preventDefault();
       return false;
   }
   if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') { // Ctrl+Shift+C
       e.preventDefault();
       return false;
   }
   if (e.ctrlKey && e.shiftKey && e.code === 'KeyJ') { // Ctrl+Shift+J
       e.preventDefault();
       return false;
   }
   if (e.ctrlKey && e.code === 'KeyU') { // Ctrl+U
       e.preventDefault();
       return false;
   }
};
