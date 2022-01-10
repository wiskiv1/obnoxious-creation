console.rainbow = function (str) {

  const colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
  ]
  
  let color_counter = 0;
  let color_direction = 1;
  let log_array = [];
  let log_string = "";
  for (var i = 0; i < str.length; i++){
      cchar = str.charAt(i)
      let color = colors[color_counter];
      let char_string;
      if(cchar != " "){
          if (color_counter >= (colors.length - 1)) {color_direction = -1};
          if (color_counter <= 0) {color_direction = 1};
          color_counter += color_direction;
          let color_string = `color:${color};font-size: large;`;
          char_string = `%c${cchar}`;
      
          log_array.push(color_string);
      } else {
          char_string = cchar;
      }
      log_string += char_string;
  }
  log_array.unshift(log_string);
  
  this.log(...log_array);
  };