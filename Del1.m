%% Börja om efter ANNAS hjälp

values = 301;

tid = linspace(0,1,values);

force = zeros(1, values);
force(1) = 1;
force(2) = 1;
radie = 0.1; %meter
massa = 0.01; %kilogram
langd = 0.1;
bredd = 0.1;
g = 9.82;

acce = zeros(1, values);
hastighet = zeros(1, values);
vinkel = zeros(1, values);

vinkel(1) = pi/2;

troghet = massa/3*(langd^2+bredd^2);
step = 1/values;
for idx = 2:values
    acce(1,idx) = (1/troghet)*(force(idx)*radie) + g*massa*cos(vinkel(idx-1));
    hastighet(1,idx) = hastighet(idx-1) + step*acce(idx);
    vinkel(1,idx) = (vinkel(idx-1) - step*hastighet(idx));
    if vinkel(1,idx) <0
        vinkel(1,idx) =0;

        hastighet(1,idx) = -hastighet(idx-1)*0.2;

        %acce(1, idx) = 0;
    end
end

plot(tid,acce);
figure
plot(tid, hastighet);
figure
plot(tid, vinkel);