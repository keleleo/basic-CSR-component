const html =
  /* html */
  `
  <div>Event: {{event}}</div>
  <div>Time: {{time}}</div>
  <div>
    <button click="click('click',$event)">click</button>
    <button mousedown="mousedown('mousedown',$event)">mousedown</button>
    <button mouseenter="mouseenter('mouseenter',$event)">mouseenter</button>
    <button mouseleave="mouseleave('mouseleave',$event)">mouseleave</button>
    <button mousemove="mousemove('mousemove',$event)">mousemove</button>
    <button mouseout="mouseout('mouseout',$event)">mouseout</button>
    <button mouseover="mouseover('mouseover',$event)">mouseover</button>
    <button mouseup="mouseup('mouseup',$event)">mouseup</button>
  </div>
  `;
class Component {
  event = '...';
  time = 0;
  onEvent(name: string, event: Event) {
    this.event = name;
    this.time = Date.now();
  }
  click = (name: string, event: Event) => this.onEvent(name, event);
  mousedown = (name: string, event: Event) => this.onEvent(name, event);
  mouseenter = (name: string, event: Event) => this.onEvent(name, event);
  mouseleave = (name: string, event: Event) => this.onEvent(name, event);
  mousemove = (name: string, event: Event) => this.onEvent(name, event);
  mouseout = (name: string, event: Event) => this.onEvent(name, event);
  mouseover = (name: string, event: Event) => this.onEvent(name, event);
  mouseup = (name: string, event: Event) => this.onEvent(name, event);
}

export const testeMouse = { html, component: Component, tag: 'teste-mouse' };
