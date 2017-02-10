%% Translation & Rotation


close all
values = 8001;
tid = linspace(0,1,values);
gravity = 9.82; % m/s^2

% Blockets konstanter
mass = 5; %kg
langd = 1; %Meter
bredd = 1; %Meter
troghet = mass/3*(langd^2+bredd^2); %kg/m^2

% Konstanter mellan block och golv
frictionStill = 0.5;
frictionMove = 0.2;
CoR = 0.5;% bara ett tal mellan 0-1, studskoefficient

% Kraftp�verkans konstanter
force = zeros(values,1);
force(1) = 100; %newton
forceAngle = 1;%radian
radie = 0.2; %Meter
% Om radie < Hmin -> tippar bak�t, Om radie > Hmax -> tippar fram�t
Hmin = (((force(1)*langd)/2) - ((mass*gravity*bredd)/2) - ((frictionStill * langd)/2)) / force(1); %Meter
Hmax = (((force(1)*langd)/2) + ((mass*gravity*bredd)/2) - ((frictionStill * langd)/2)) / force(1); %Meter

% Translation x-led
velx = zeros(values,1);
posx = zeros(values,1);
accx = zeros(values,1);

% Translation y-led
vely = zeros(values,1);
posy = zeros(values,1);
accy = zeros(values,1);

%Rotation runt z-axeln
acce = zeros(1, values);
hastighet = zeros(1, values);
vinkel = zeros(1, values);

% Startv�rden
vinkel(1) = pi/2; % Startvinkel, radian
posy(1) = 5; %start position on y-axis

step = 1/1000; %Step size
for index = 1:values-1
    
    if radie < Hmin % Faller bak�t
        
        % Rotation kring z-axel, bak�t
        acce(1,index+1) = ((1/troghet)*(force(index)*radie) + gravity*mass*cos(vinkel(index)));
        hastighet(1,index+1) = hastighet(index) + step*acce(index);
        vinkel(1,index+1) = (vinkel(index) + (step*hastighet(index)));
        
        % Translation i x-led
        if ( cos(forceAngle) * force(1) >= frictionStill)
            accx(index) = 1/mass * ((cos(forceAngle) * force(index)) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * ((sin(forceAngle) * force(index)) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
        
        if vinkel(1,index) > pi
            vinkel(1,index+1) = pi;
            hastighet(1,index+1) = -hastighet(index)*CoR;
        end
    elseif radie > Hmax % Faller fram�t
        
        %Rotation kring z-axeln, fram�t
        acce(1,index) = (1/troghet)*(force(index)*radie) + gravity*mass*cos(vinkel(index));
        hastighet(1,index+1) = hastighet(index) + step*acce(index);
        vinkel(1,index+1) = (vinkel(index) - (step*hastighet(index)));
        
        % Translation i x-led
        if ( cos(forceAngle) * force(1) >= frictionStill)
            accx(index) = 1/mass * ((cos(forceAngle) * force(index)) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * ((sin(forceAngle) * force(index)) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
        if vinkel(1,index) < 0
            vinkel(1,index+1) = 0;
            hastighet(1,index+1) = -hastighet(index)*CoR;
        end
    else % Translateras endast
        vinkel(1,index) = 0;
        hastighet(1,index) = 0;
        acce(1, index) = 0;
        
        % Translation i x-led
        if ( cos(forceAngle) * force(1) >= frictionStill)
            accx(index) = 1/mass * ((cos(forceAngle) * force(index)) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * ((sin(forceAngle) * force(index)) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
    end
end


subplot(3,3,1)
plot(tid,accx);
title('Acceleration x-led')
subplot(3,3,2)
plot(tid,velx);
title('Hastighet x-led')
subplot(3,3,3)
plot(tid,posx);
title('Position x-led')
subplot(3,3,4)
plot(tid,accy);
title('Acceleration y-led')
subplot(3,3,5)
plot(tid,vely);
title('Hastighet y-led')
subplot(3,3,6)
plot(tid,posy);
title('Position y-led')
subplot(3,3,7)
plot(tid,acce);
title('Vinkelacceleration')
subplot(3,3,8)
plot(tid, hastighet);
title('Vinkelhastighet')
subplot(3,3,9)
plot(tid, vinkel);
title('Vinkel')

