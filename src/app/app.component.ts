import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  canvas: fabric.Canvas | null = null;
  score: number = 0;
  time: number = 60; // seconds
  intervalId: NodeJS.Timeout | null = null;

  get formattedTime() {
    const updatedTime = this.time < 10 ? `0${this.time}` : this.time.toString();
    return this.time < 60 ? `00:${updatedTime}` : "01:00";
  }
  
  ngOnInit() {
    this.initCanvas();
    this.initCircles();
    this.initButtons();
  }

  private initButtons() {
    const startBtn = document.querySelector('.start-btn');
    startBtn?.addEventListener('click', () => {
      this.startTimer();
    });
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn?.addEventListener('click', () => {
      this.reset();
    })
  }

  private startTimer() {
    if(this.time === 60) {
      this.intervalId = setInterval(() => {
        if(--this.time <= 0) {
          this.resetTimer();
        }
      }, 1000)
    }
  }

  private reset() {
    this.resetTimer();
    this.resetCircles();
    this.time = 60;
    this.score = 0;
  }

  private resetCircles() {
    this.canvas?.forEachObject(obj => {
      this.canvas?.remove(obj);
    });
    this.initCircles();
  }

  private resetTimer() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initCanvas() {
    this.canvas = new fabric.Canvas('canvas', {
      selection: false
    });    
  }

  private initCircles() {
    for(let i = 0; i < 10; i++) {
      this.addCircle();
    }
  }

  private addCircle() {
    const randX = this.getRandomVal(100, 900);
    const randY = this.getRandomVal(100, 400);
    this.drawCircle(randX, randY);
  }

  private getRandomVal(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private drawCircle(left: number, top: number) {
    const circle = new fabric.Circle({
      radius: 20, 
      fill: 'green', 
      left: left,
      top: top,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer'
    });

    circle.on('mousedown', () => {
      if(this.time > 0 && this.time < 60) {
        this.score++;
        this.canvas?.remove(circle);
        this.addCircle();
      }      
    });
    this.canvas?.add(circle);
  }

}
