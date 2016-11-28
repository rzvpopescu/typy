class Student{
    name:String;
    age:number;
    
    constructor(name:string,age:number) {
        this.name = name;
        this.age = age;                
    }
}

export default class CommonBindings{
    title:String = 'Common bindings';

    name:String = 'John';

    persons:Array<string> = ['John','Marry','Agnes','Edward'];

    newPersonName:string;

    students:Array<Student> =  new Array<Student>();

    isVisible:boolean =  false;

    canRender:boolean =  false;

    isSuccess:boolean =  true;

    httpAddress:string;

    constructor(){

        this.populateStudents();

    }


    populateStudents(){
        this.students.push(new Student('John',22));
        this.students.push(new Student('Mary',21));
        this.students.push(new Student('Agnes',20));
        this.students.push(new Student('Edward',24));
    }

    addStudent(){
        this.students.push(new Student(prompt("Introduce name"),parseInt(prompt("Introduce age"))));
    }

    deleteStudent(student:Student){
        this.students.splice(this.students.indexOf(student),1);
    }

    displayGreetings(){
        alert(`Hello ${this.name} ! Welcome !`);
    }

    addPerson(){
        this.persons.push(this.newPersonName);
    }

    show(){
        this.isVisible =  true;
    }
    hide(){
        this.isVisible =  false;
    }

    changeRender(){
        this.canRender = !this.canRender;
    }

    toggleSuccess(){
        this.isSuccess = !this.isSuccess;
    }
}