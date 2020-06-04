import Panel from './Panel';

window.addEventListener('load', () => {
  const panels = document.querySelectorAll('.js-panel') as NodeListOf<HTMLElement>;
  panels.forEach((_, index): {} => new Panel(panels[index]));
});
