Radial Menu
===========
An HTML/CSS/JavaScript implementation of the lovely radial menu in the [Path][] app.

[See the demo][demo] (works best on Safari and Mobile Safari, Chrome does pretty well, Firefox is
pretty blah, and don't bother with android.)

[demo]: http://beaucollins.github.com/radial-menu
[Path]: https://path.com/

Markup
-----

Adapts to the number of links you have in your menu.

    <nav>
      <ul>
        <li><a href="#">1</a></li>
        <li><a href="#">2</a></li>
        <li><a href="#">3</a></li>
      </ul>
    </nav>

Configure the radius and the degrees to be used for the arc.

    var m = new Menu(document.querySelector('nav'), {
      radius: 130,
      degrees: 90,
      offset: -90
    });
    
