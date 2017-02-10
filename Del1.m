%% Rotation runt Z-axeln.

values = 8001; %Antal samples
tid = linspace(0,1,values);
force = zeros(1, values);
force(1) = 100; %Newton
force(2) = 100; %Newton
radie = 0.8; %Meter
massa = 5.0; %kilogram
langd = 1; %Meter
bredd = 1; %Meter
g = 9.82;  %m/s^2
Ff = 0.1;  %Newton
CoR = 0.5;% bara ett tal mellan 0-1, studskoefficient

acce = zeros(1, values);
hastighet = zeros(1, values);
vinkel = zeros(1, values);

vinkel(1) = pi/2; % Startvinkel, radian
% Om radie < Hmin -> tippar bakåt, Om radie > Hmax -> tippar framåt 
Hmin = (((force(1)*langd)/2) - ((massa*g*bredd)/2) - ((Ff* langd)/2)) / force(1); %Meter
Hmax = (((force(1)*langd)/2) + ((massa*g*bredd)/2) - ((Ff* langd)/2)) / force(1); %Meter


troghet = massa/3*(langd^2+bredd^2); %kg/m^2
step = 1/1000; %Step size
ifsats = 0;
for idx = 2:values
     if radie < Hmin % Faller bakåt
        
        acce(1,idx) = ((1/troghet)*(force(idx)*radie) + g*massa*cos(vinkel(idx-1)));
        hastighet(1,idx) = hastighet(idx-1) + step*acce(idx);
        vinkel(1,idx) = (vinkel(idx-1) + (step*hastighet(idx)));
        
        if vinkel(1,idx) > pi 
            vinkel(1,idx) = pi;
            hastighet(1,idx) = -hastighet(idx-1)*CoR;
            ifsats = 1;
        end
        loop = 1; 
        
    elseif radie > Hmax % Faller framåt
          
            acce(1,idx) = (1/troghet)*(force(idx)*radie) + g*massa*cos(vinkel(idx-1));
            hastighet(1,idx) = hastighet(idx-1) + step*acce(idx);
            vinkel(1,idx) = (vinkel(idx-1) - (step*hastighet(idx)));
        
            if vinkel(1,idx) < 0
                vinkel(1,idx) = 0;
                hastighet(1,idx) = -hastighet(idx-1)*CoR;
            end
            loop = 2;
    else % Translateras endast
        vinkel(1,idx) = 0;
        hastighet(1,idx) = 0;
        acce(1, idx) = 0;  
        loop = 3;
    end
end

subplot(1,3,1)
plot(tid,acce);
subplot(1,3,2)
plot(tid, hastighet);
subplot(1,3,3)
plot(tid, vinkel);

%%
