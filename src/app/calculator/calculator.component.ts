import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public input: string = '';
  public result: string = '';
  private char: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
  constructor() { }

  @HostListener('document:keyup', ['$event']) keyEventListener($event: KeyboardEvent) {
    this.char.forEach((el) => {
      $event.key === el ? this.pressNum(el) : this.checkOp($event.key);
    })
    console.log($event);
  }

  private checkOp(event: any) {
    switch (event) {
      case '+':
        return this.pressOperator('+');
      case '-':
        return this.pressOperator('-');
      case '/':
        return this.pressOperator('/');
      case '*':
        return this.pressOperator('*');
      case 'Enter':
        return this.getAnswer();
      case 'Backspace':
        return this.clear();
      case 'c':
      case 'C':
        return this.allClear();
      default: return '';
    }
  }

  //Do Not Allow . more than once
  public pressNum(num: string): void {
    if (num == ".") {
      if (this.input != "") {
        const lastNum = this.getLastOperand();
        // console.log(lastNum.lastIndexOf("."));
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }

    //Do Not Allow 0 at beginning. 
    //Javascript will throw Octal literals are not allowed in strict mode.
    if (num == "0") {
      if (this.input == "") {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+') {
        return;
      }
    }
    this.input = this.input + num
    this.calcAnswer();
  }

  private getLastOperand(): string {
    let pos: number;
    // console.log(this.input);
    pos = this.input.lastIndexOf("+");
    if (this.input.lastIndexOf("-") > pos) pos = this.input.lastIndexOf("-");
    if (this.input.lastIndexOf("*") > pos) pos = this.input.lastIndexOf("*");
    if (this.input.lastIndexOf("/") > pos) pos = this.input.lastIndexOf("/");
    console.log('Last ' + this.input.substring(pos + 1));
    return this.input.substring(pos + 1);
  }

  public pressOperator(op: string): void {
    //Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+') {
      return;
    }
    this.input = this.input + op
    this.calcAnswer();
  }

  public clear(): void {
    console.log(this.input.length);
    if (this.input != "") {
      this.input = this.input.substring(0, this.input.length - 1)
    }
  }

  public allClear(): void {
    this.input = '';
  }

  public getAnswer(): void {
    this.calcAnswer();
    this.input = this.result;
    if (this.input == "0") this.input = "";
  }

  private calcAnswer(): void {
    let formula = this.input;

    let lastKey = formula[formula.length - 1];

    if (lastKey === '.') {
      formula = formula.substring(0, formula.length - 1);
    }

    lastKey = formula[formula.length - 1];

    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.') {
      formula = formula.substring(0, formula.length - 1);
    }

    // console.log("Formula " + formula);
    this.result = eval(formula);
  }

  ngOnInit(): void {
  }

}
