document.addEventListener('DOMContentLoaded', function() {
    const shapesContainer = document.getElementById('shapes-container');
    const addShapeBtn = document.getElementById('add-shape');
    const shapeTypeSelect = document.getElementById('shape-type');
    const shapeColorInput = document.getElementById('shape-color');
    const clearShapesBtn = document.getElementById('clear-shapes');
    
    class Shape {
        constructor(color) {
            this.color = color;
            this.element = document.createElement('div');
            this.element.className = 'shape';
            this.element.style.backgroundColor = color;
            this.element.addEventListener('click', () => this.describe());
        }
        
        describe() {
            alert(`Ez egy ${this.constructor.name.toLowerCase()} alakzat, színe: ${this.color}`);
        }
        
        render() {
            shapesContainer.appendChild(this.element);
            return this;
        }
    }
    
    class Circle extends Shape {
        constructor(color) {
            super(color);
            this.element.style.borderRadius = '50%';
            this.element.style.width = '100px';
            this.element.style.height = '100px';
        }
    }
    
    class Rectangle extends Shape {
        constructor(color) {
            super(color);
            this.element.style.width = '150px';
            this.element.style.height = '100px';
        }
    }
    
    class Triangle extends Shape {
        constructor(color) {
            super(color);
            this.element.style.width = '0';
            this.element.style.height = '0';
            this.element.style.borderLeft = '75px solid transparent';
            this.element.style.borderRight = '75px solid transparent';
            this.element.style.borderBottom = `150px solid ${color}`;
            this.element.style.backgroundColor = 'transparent';
        }
    }
    
    class ShapeFactory {
        static createShape(type, color) {
            switch (type) {
                case 'circle':
                    return new Circle(color);
                case 'rectangle':
                    return new Rectangle(color);
                case 'triangle':
                    return new Triangle(color);
                default:
                    throw new Error('Ismeretlen alakzat típus');
            }
        }
    }
    
    addShapeBtn.addEventListener('click', function() {
        const type = shapeTypeSelect.value;
        const color = shapeColorInput.value;
        
        try {
            const shape = ShapeFactory.createShape(type, color);
            shape.render();
        } catch (error) {
            alert(error.message);
        }
    });
    
    clearShapesBtn.addEventListener('click', function() {
        shapesContainer.innerHTML = '';
    });
});