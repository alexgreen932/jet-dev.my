

// === Parses the value into keyframes + options ===
export default function resolvePropertyValue(prop, value) {
    const resolved = {};
  
    switch (prop) {
      case 'fade':
        resolved.opacity = value;
        break;
  
      case 'slideTop':
        resolved.transform = `translateY(-${value}px)`;
        break;
  
      case 'slideBottom':
        resolved.transform = `translateY(${value}px)`;
        break;
  
      case 'slideLeft':
        resolved.transform = `translateX(-${value}px)`;
        break;
  
      case 'slideRight':
        resolved.transform = `translateX(${value}px)`;
        break;
  
      case 'scale':
        resolved.transform = `scale(${value})`;
        break;
  
      case 'rotate':
        resolved.transform = `rotate(${value}deg)`;
        break;
  
      default:
        resolved[prop] = value;
    }
  
    return resolved;
  } 

