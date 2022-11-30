#version 300 es
precision highp float;
 
in float height;

uniform vec4 u_color;
out vec4 outColor;
void main() {
  
  outColor = u_color;
  outColor.rgb *= (height/50.0)*(height/50.0); //+ (height/255.0) * vec3(0.0, 0.01, 0.05);
  
 
  
  
}