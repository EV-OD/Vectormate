#include "rectangle.h";
#include <iostream>
 
rectangle::rectangle(double l, double w) : length(l), width(w) {
    std::cout << "This is a rectangle with length: " << length << " and width: " << width << std::endl;
}