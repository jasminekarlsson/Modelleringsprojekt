
%%Translation x -led

close all

values = 101;
%time = linspace(0, values);
mass = 0.5; %kg
frictionStill = 0.5;
frictionMove = 0.2;
step = 0.01; %step size
velx = zeros(values,1);
posx = zeros(values,1);
accx = zeros(values,1);
force = zeros(values,1);
force(1) = 0.6; %newton
forceAngle = 1;%radian

for index = 1:values
   if ( cos(forceAngle) * force(index) >= frictionStill)
    accx(index) = 1/mass * (cos(forceAngle) * force(index) - frictionMove * velx(index));
    velx(index+1) = velx(index) + step * accx(index);
    posx(index+1) = posx(index) + step * velx(index);
   else
       accx(index) = 0;
       velx(index+1) = 0;
       posx(index+1) = 0;    
   end
    
end

plot(accx);
figure
plot(velx),
figure
plot(posx);

%% Translation y-led

close all

values = 101;
mass = 0.5; %kg
frictionStill = 0.5;
frictionMove = 0.2;
step = 0.01; %step size
vely = zeros(values,1);
posy = zeros(values,1);
posy(1) = 0.2; %start position on y-axis
accy = zeros(values,1);
force = zeros(values,1);
force(1) = 10; %newton
forceAngle = 1;%radian
gravity = 9.82; % m/s^2

for index = 1:values
   if posy(index) > 0
       accy(index) = 1/mass * (sin(forceAngle) * (force(index) - gravity));
       vely(index+1) = vely(index) + step * accy(index);
       posy(index+1) = posy(index) + step * vely(index);
   else
       accy(index) = 0;
       vely(index+1) = 0;
       posy(index+1) = 0;  
   end
    
end

plot(accy);
figure
plot(vely),
figure
plot(posy);

