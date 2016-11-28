
export default class Home{
    title:string = 'Set-up';
    
    person:any = {
        name:'John',
        age:22,
        gender:'male',
        employeed:true,
        employer:'BigCorp Company'
    }

    genders:Array<string> = ['male','female'];

    displaySummary(){
        let message = `I'm ${this.person.name}. I am a ${this.person.age} years old ${this.person.gender} !`;
        alert(message);
    }
  
}