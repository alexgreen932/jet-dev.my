function Anime() {
    console.log('anime loaded');
    // Individual animations
    let items = document.querySelectorAll('.ja');

    items.forEach(item => {
        // Identify the animation-specific class
        const animationClass = Array.from(item.classList).find(cls => cls.startsWith('ja-'));
        if (!animationClass) {
            return; // Skip if no animation class is defined
        }

        item.classList.add('opacity-0'); // Add class opacity 0
        item.classList.remove(animationClass); // Temporarily remove animation class 

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.classList.add('j-active', animationClass);
                        item.classList.remove('ja'); // Remove opacity 0
                        item.classList.remove('opacity-0'); // Remove opacity 0
                    }, 250);
                } else {
                    item.classList.remove('j-active', animationClass);
                    item.classList.add('ja'); // Add opacity 0
                    item.classList.add('opacity-0'); // Add opacity 0
                }
            });
        }, { threshold: [0.25] });

        observer.observe(item);
    });

   // Grouped animations
   let groupedItems = document.querySelectorAll('.jag');

   groupedItems.forEach(group => {
       // Extract animation class from the parent group
       const animationClass = Array.from(group.classList).find(cls => cls.startsWith('ja-'));
       if (!animationClass) {
           return; // Skip if no animation class is defined on the parent
       }

       let children = Array.from(group.children);

       // Add initial opacity to children
       children.forEach(child => {
           if (!child.classList.contains('el-exclude')) {
               child.classList.add('opacity-0'); // Add class opacity 0
           }
       });

       const observer = new IntersectionObserver(entries => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   // Animate each child with a staggered delay
                   children.forEach((child, index) => {
                       if (!child.classList.contains('el-exclude')) {
                           const delay = 250 * (index + 1); // Adjust delay multiplier as needed
                           setTimeout(() => {
                               child.classList.add('j-active', animationClass);
                               child.classList.remove('ja'); 
                               child.classList.remove('opacity-0'); // Remove opacity 0
                           }, delay);
                       }
                   });
               } else {
                   // Reset animations when out of the viewport
                   children.forEach(child => {
                       if (!child.classList.contains('el-exclude')) {
                           child.classList.remove('j-active', animationClass);
                           child.classList.add('ja');
                           child.classList.add('opacity-0'); // Add opacity 0
                       }
                   });
               }
           });
       }, { threshold: [0.25] });

       observer.observe(group);
   });
}

export default function initializeAnimation(){

}
