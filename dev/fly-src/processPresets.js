export default function processPresets(value) {
    switch (value) {
      case 'fade':
        return 'opacity(0,1); {d:800}';
      case 'fadeIn':
        return 'opacity(0,1); {d:800}';
      case 'fadeOut':
        return 'opacity(1,0); {d:800}';
      case 'fadeUp':
        return 'opacity(0,1); slideBottom(50,0); {d:1000}';
      case 'fadeDown':
        return 'opacity(0,1); slideTop(50,0); {d:1000}';
      case 'fadeLeft':
        return 'opacity(0,1); slideRight(50,0); {d:1000}';
      case 'fadeRight':
        return 'opacity(0,1); slideLeft(50,0); {d:1000}';
      case 'zoomIn':
        return 'opacity(0,1); scale(0.5, 1); {d:1000}';
      case 'zoomOut':
        return 'opacity(1,0); scale(1, 0.5); {d:1000}';
      case 'pop':
        return 'scale(0.5, 1.1, 1); {d:1000, offset:0,0.8,1}';
      case 'shakeX':
        return 'transform(-10, 10, -6, 6, -2, 2, 0); {d:500}';
      case 'slideTop':
      case 'slideDown': // alias for slideTop
        return 'slideTop(50,0); {d:1000}';
      case 'slideBottom':
      case 'slideUp': // alias for slideBottom
        return 'slideBottom(50,0); {d:1000}';
      case 'slideLeft':
        return 'slideLeft(50,0); {d:1000}';
      case 'slideRight':
        return 'slideRight(50,0); {d:1000}';
      case 'rotateIn':
        return 'rotate(-180, 0); opacity(0,1); {d:1000}';
      default:
        return value;
    }
  }
