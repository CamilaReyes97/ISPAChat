export class User { // creamos una clase, La expresión class es una forma de definir una clase en ECMAScript 2015 (ES6). Similar a las funciones, las expresiones de clase pueden ser nombradas o no. Si se nombran, el nombre de la clase es local sólo en el cuerpo de la clas
    // Creamos un constructor, El método constructor es un metodo especial para crear e inicializar un objeto creado a partir de una clase.
    constructor( //este contrusctor es quien nos permite recibir y enviarlos datos a los modelos
        public _id: string,
        public nombre: string,
        public email: string,
        public password: string,
        public imagen: string,
        public telefono: string,
        public bio: string,
        public curso: string,
        public estado: boolean  //estado de conexion
    ) {
    }
}