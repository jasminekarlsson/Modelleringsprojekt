%% Translation & Rotation


close all
values = 8001;
tid = linspace(0,1,values);
gravity = 9.82; % m/s^2

% Blockets konstanter
mass = 5; %kg
hojd = 1; %Meter
bredd = 1; %Meter
djup = 1; %Meter

troghetx = mass/3*(hojd^2+djup^2); %kg/m^2
troghety = mass/3*(bredd^2+djup^2); %kg/m^2
troghetz = mass/3*(hojd^2+bredd^2); %kg/m^2
% Konstanter mellan block och golv
frictionStill = 0.5;
frictionMove = 0.2;
CoR = 0.5;% bara ett tal mellan 0-1, studskoefficient

% Kraftpåverkans konstanter
<<<<<<< HEAD
force = zeros(values,3);
force(1,1) = 100; %newton
force(1,2) = 100; %newton
force(1,3) = 100; %newton
forceLength(1:values) = sqrt(force(1:values,1).^2 + force(1:values,2).^2 + force(1:values,3).^2);
forceAngle1 = atan(sqrt(force(1,1).^2 + force(1,3).^2)/force(1,2)); %radian
forceAngle2 = atan(force(1,3)/force(1,1));%radian
%forcex(1:values) = forceLength(1:values)*(sin(forceAngle2)*cos(forceAngle1)); %Newton
%forcey(1:values) = sin(forceAngle2) * forceLength(1:values); %Newton
%forcez(1:values) = forceLength(1:values)*(sin(forceAngle2)*sin(forceAngle1)); %Newton
forcex(1:values) = force(1:values,1); %Newton
forcey(1:values) = force(1:values,2); %Newton
forcez(1:values) = force(1:values,3); %Newton
radie = 0.8; %Meter

=======
force = zeros(values,1);
force(1) = 100; %newton
forceAngle = 1;%radian
radie = 0.2; %Meter
>>>>>>> master
% Om radie < Hmin -> tippar bakåt, Om radie > Hmax -> tippar framåt
% Rotation rund x-axeln
% Oklart vad som gäller? Snacka med ULF
Hminx = (((force(1)*bredd)/2) - ((mass*gravity*djup)/2) - ((frictionStill * bredd)/2)) / forcex(1); %Meter
Hmaxx = (((force(1)*bredd)/2) + ((mass*gravity*djup)/2) - ((frictionStill * bredd)/2)) / forcex(1); %Meter
% Rotation runt y-axeln
Hminy = (((force(1)*hojd)/2) - ((mass*gravity*djup)/2) - ((frictionStill * hojd)/2)) / forcey(1); %Meter
Hmaxy = (((force(1)*hojd)/2) + ((mass*gravity*djup)/2) - ((frictionStill * hojd)/2)) / forcey(1); %Meter
% Rotation runt z-axeln
Hminz = (((force(1)*hojd)/2) - ((mass*gravity*bredd)/2) - ((frictionStill * hojd)/2)) / forcez(1); %Meter
Hmaxz = (((force(1)*hojd)/2) + ((mass*gravity*bredd)/2) - ((frictionStill * hojd)/2)) / forcez(1); %Meter

% Translation x-led
accx = zeros(values,1);
velx = zeros(values,1);
posx = zeros(values,1);

% Translation y-led
accy = zeros(values,1);
vely = zeros(values,1);
posy = zeros(values,1);

% Translation z-led
accz = zeros(values,1);
velz = zeros(values,1);
posz = zeros(values,1);

%Rotation runt z-axeln
vinkaccex = zeros(1, values);
vinkhastx = zeros(1, values);
vinkelx = zeros(1, values);

%Rotation runt z-axeln
vinkaccey = zeros(1, values);
vinkhasty = zeros(1, values);
vinkely = zeros(1, values);

%Rotation runt z-axeln
vinkaccez = zeros(1, values);
vinkhastz = zeros(1, values);
vinkelz = zeros(1, values);

% Startvärden
vinkelx(1) = pi/2; % Startvinkel, radian
vinkelz(1) = pi/2; % Startvinkel, radian
posy(1) = 5; %start position on y-axis


step = 1/1000; %Step size
for index = 1:values-1
    
    
    
    if radie < Hminz % Faller bakåt
        
         %Rotation kring x-axeln, framåt
        vinkaccex(1,index) = (1/troghetx)*(forcez(index)*radie) + gravity*mass*cos(vinkelx(index));
        vinkhastx(1,index+1) = vinkhastx(index) + step*vinkaccex(index);
        vinkelx(1,index+1) = (vinkelx(index) - (step*vinkhastx(index)));
        %if vinkelx(1,index) < 0
        %    vinkelx(1,index+1) = 0;
        %    vinkhastx(1,index+1) = -vinkhastx(index)*CoR;
        %end
        
        %Rotation kring y-axeln, framåt
        vinkaccey(1,index) = (1/troghety)*(forcex(index)*radie) - frictionMove * vinkhasty(index);
        vinkhasty(1,index+1) = vinkhasty(index) + step*vinkaccey(index);
        vinkely(1,index+1) = (vinkely(index) - (step*vinkhasty(index)));
        if vinkely(1,index) < 0
            vinkely(1,index+1) = 0;
            vinkhasty(1,index+1) = -vinkhasty(index)*CoR;
        end
        
        %Rotation kring z-axeln, framåt
        vinkaccez(1,index) = (1/troghetz)*(forcex(index)*radie) + gravity*mass*cos(vinkelz(index));
        vinkhastz(1,index+1) = vinkhastz(index) + step*vinkaccez(index);
        vinkelz(1,index+1) = (vinkelz(index) - (step*vinkhastz(index)));
        if vinkelz(1,index) < 0
            vinkelz(1,index+1) = 0;
            vinkhastz(1,index+1) = -vinkhastz(index)*CoR;
        end
        
        % Translation i x-led
        if ( forcex(1)  >= frictionStill)
            accx(index) = 1/mass * (forcex(index) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * (forcey(index) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
        
        % Translation i z-led
        if ( forcez(1) >= frictionStill)
            accz(index) = 1/mass * (forcez(index) - frictionMove * velz(index));
            velz(index+1) = velz(index) + step * accz(index);
            posz(index+1) = posz(index) + step * velz(index);
        else
            accz(index) = 0;
            velz(index+1) = 0;
            posz(index+1) = 0;
        end
        
        if vinkelz(1,index) > pi
            vinkelz(1,index+1) = pi;
            vinkhastz(1,index+1) = -vinkhastz(index)*CoR;
        end
    elseif radie > Hmaxz % Faller framåt
        
         %Rotation kring x-axeln, framåt
        vinkaccex(1,index) = (1/troghetx)*(forcez(index)*radie) + gravity*mass*abs(cos(vinkelx(index)));
        vinkhastx(1,index+1) = vinkhastx(index) + step*vinkaccex(index);
        vinkelx(1,index+1) = (vinkelx(index) - (step*vinkhastx(index)));
        if vinkelx(1,index) < 0
            vinkelx(1,index+1) = 0;
            vinkhastx(1,index+1) = -vinkhastx(index)*CoR;
        end
        
        %Rotation kring y-axeln, framåt
        vinkaccey(1,index) = (1/troghety)*(forcex(index)*radie) - frictionMove * vinkhasty(index);
        vinkhasty(1,index+1) = vinkhasty(index) + step*vinkaccey(index);
        vinkely(1,index+1) = (vinkely(index) - (step*vinkhasty(index)));
        %if vinkely(1,index) < 0
        %    vinkely(1,index+1) = 0;
        %    vinkhasty(1,index+1) = -vinkhasty(index)*CoR;
        %end
        
        %Rotation kring z-axeln, framåt
        vinkaccez(1,index) = (1/troghetz)*(forcex(index)*radie) + gravity*mass*cos(vinkelz(index));
        vinkhastz(1,index+1) = vinkhastz(index) + step*vinkaccez(index);
        vinkelz(1,index+1) = (vinkelz(index) - (step*vinkhastz(index)));
        if vinkelz(1,index) < 0
            vinkelz(1,index+1) = 0;
            vinkhastz(1,index+1) = -vinkhastz(index)*CoR;
        end
         % Translation i x-led
        if ( forcex(1)  >= frictionStill)
            accx(index) = 1/mass * (forcex(index) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * (forcey(index) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
            
        % Translation i z-led
        if ( forcez(1) >= frictionStill)
            accz(index) = 1/mass * (forcez(index) - frictionMove * velz(index));
            velz(index+1) = velz(index) + step * accz(index);
            posz(index+1) = posz(index) + step * velz(index);
        else
            accz(index) = 0;
            velz(index+1) = 0;
            posz(index+1) = 0;
        end
        
    else % Translateras endast
        
        vinkelx(1,index) = 0;
        vinkhastx(1,index) = 0;
        vinkaccex(1, index) = 0;
        vinkely(1,index) = 0;
        vinkhasty(1,index) = 0;
        vinkaccey(1, index) = 0;
        vinkelz(1,index) = 0;
        vinkhastz(1,index) = 0;
        vinkaccez(1, index) = 0;
        
         % Translation i x-led
        if ( forcex(1)  >= frictionStill)
            accx(index) = 1/mass * (forcex(index) - frictionMove * velx(index));
            velx(index+1) = velx(index) + step * accx(index);
            posx(index+1) = posx(index) + step * velx(index);
        else
            accx(index) = 0;
            velx(index+1) = 0;
            posx(index+1) = 0;
        end
        
        % Translation i y-led
        if posy(index) > 0
            accy(index) = 1/mass * (forcey(index) - gravity * mass);
            vely(index+1) = vely(index) + step * accy(index);
            posy(index+1) = posy(index) + step * vely(index);
        else
            accy(index) = 0;
            vely(index+1) = 0;
            posy(index+1) = 0;
        end
        
       % Translation i z-led
        if ( forcez(1) >= frictionStill)
            accz(index) = 1/mass * (forcez(index) - frictionMove * velz(index));
            velz(index+1) = velz(index) + step * accz(index);
            posz(index+1) = posz(index) + step * velz(index);
        else
            accz(index) = 0;
            velz(index+1) = 0;
            posz(index+1) = 0;
        end
    end
end


subplot(6,3,1)
plot(tid,accx);
title('Acceleration x-led')
subplot(6,3,2)
plot(tid,velx);
title('Hastighet x-led')
subplot(6,3,3)
plot(tid,posx);
title('Position x-led')
subplot(6,3,4)
plot(tid,accy);
title('Acceleration y-led')
subplot(6,3,5)
plot(tid,vely);
title('Hastighet y-led')
subplot(6,3,6)
plot(tid,posy);
title('Position y-led')
subplot(6,3,7)
plot(tid,accz);
title('Acceleration z-led')
subplot(6,3,8)
plot(tid,velz);
title('Hastighet z-led')
subplot(6,3,9)
plot(tid,posz);
title('Position z-led')
subplot(6,3,10)
plot(tid,vinkaccex);
title('Vinkelacceleration runt x')
subplot(6,3,11)
plot(tid, vinkhastx);
title('Vinkelhastighet runt x')
subplot(6,3,12)
plot(tid, vinkelx);
title('Vinkel runt x')
subplot(6,3,13)
plot(tid,vinkaccey);
title('Vinkelacceleration runt y')
subplot(6,3,14)
plot(tid, vinkhasty);
title('Vinkelhastighet runt y')
subplot(6,3,15)
plot(tid, vinkely);
title('Vinkel runt y')
subplot(6,3,16)
plot(tid,vinkaccez);
title('Vinkelacceleration runt z')
subplot(6,3,17)
plot(tid, vinkhastz);
title('Vinkelhastighet runt z')
subplot(6,3,18)
plot(tid, vinkelz);
title('Vinkel runt z')

