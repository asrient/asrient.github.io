/***********************************
Identify identifier
***********************************/

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
int main() {
    char a[10];
    int flag, i = 1;
    printf("\n Enter an identifier:");
    gets(a);
    if (isalpha(a[0]))
        flag = 1;
    else
        printf("Not a valid identifier\n");
    while (a[i] != '\0') {
        if (!isdigit(a[i]) && !isalpha(a[i])) {
            flag = 0;
            break;
        }
        i++;
    }
    if (flag == 1)
        printf("Valid identifier\n ");
    return 0;
}

/**********************************
Regex
***********************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char s[20], c;
    int state = 0, i = 0;
    printf("\n Enter an string:");
    gets(s);
    while (s[i] != '\0') {
        c = s[i++];
        switch (state) {
            case 0:
                if (c == 'a')
                    state = 1;
                else if (c == 'b')
                    state = 2;
                else
                    state = 6;
                break;
            case 1:
                if (c == 'a')
                    state = 3;
                else if (c == 'b')
                    state = 4;
                else
                    state = 6;
                break;
            case 2:
                if (c == 'b')
                    state = 2;
                else
                    state = 6;
                break;
            case 3:
                if (c == 'a')
                    state = 3;
                else if (c == 'b')
                    state = 2;
                else
                    state = 6;
                break;
            case 4:
                if (c == 'b')
                    state = 5;
                else
                    state = 6;
                break;
            case 5:
                if (c == 'b')
                    state = 5;
                else
                    state = 6;
                break;
            case 6:
                printf("\n %s is not recognized", s);
                return 0;
            default:
                break;
        }
    }
    if (state == 1) {
        printf("\n %s is accepted under rule 'a'", s);
    } else if (state == 2 || state == 4) {
        printf("\n %s is accepted under rule 'a*b+'", s);
    } else if (state == 5) {
        printf("\n %s is accepted under rule 'abb'", s);
    }
    return 0;
}

/**********************************
Operator
**********************************/

#include <stdio.h>

int main() {
    char arr[5];
    printf("Enter any operator: ");
    scanf("%[^\n]s", arr);
    switch(arr[0]){
        case '>':{
            if(arr[1] == '='){
                printf("Operator is greater than or equal to\n");
            }
            else{
                printf("Operator is greater than\n");
            }
            break;
        }
        case '<':{
            if(arr[1] == '='){
                printf("Operator is less than or equal to\n");
            }
            else{
                printf("Operator is less than\n");
            }
            break;
        }
        case '=':{
            if(arr[1] == '='){
                printf("Operator is equal to\n");
            }
            else{
                printf("Operator is assignment\n");
            }
            break;
        }
        case '!':{
            if(arr[1] == '='){
                printf("Operator is not equal to\n");
            }
            else{
                printf("Operator is not\n");
            }
            break;
        }
        case '&':{
            if(arr[1] == '&'){
                printf("Operator is logical AND\n");
            }
            else{
                printf("Operator is bitwise AND\n");
            }
            break;
        }
        case '|':{
            if(arr[1] == '|'){
                printf("Operator is logical OR\n");
            }
            else{
                printf("Operator is bitwise OR\n");
            }
            break;
        }
        case '+':{
            if(arr[1] == '+'){
                printf("Operator is increment\n");
            }
            else{
                printf("Operator is addition\n");
            }
            break;
        }
        case '-':{
            if(arr[1] == '-'){
                printf("Operator is decrement\n");
            }
            else{
                printf("Operator is subtraction\n");
            }
            break;
        }
        case '*':{
            printf("Operator is multiplication\n");
            break;
        }
        case '/':{
            printf("Operator is division\n");
            break;
        }
        case '%':{
            printf("Operator is modulus\n");
            break;
        }
        default:
            printf("String is not an operator\n");
    }
}

/**********************************
Comment
**********************************/

#include <stdio.h>
int main() {
    int i = 0, flag = 0;
    char arr[40];
    printf("Enter the line: ");
    scanf("%[^\n]s", arr);
    if (arr[0] == '/') {
        if (arr[1] == '/') {
            flag = 1;
        } else if (arr[1] == '*') {
            for (i = 2; arr[i] != '\0' && i < 39; i++) {
                if (arr[i] == '*' && arr[i + 1] == '/') {
                    flag = 2;
                    break;
                }
            }
        }
    }
    if (flag == 1) {
        printf("Line is a single-line comment\n");
    } else if (flag == 2) {
        printf("Line is a multi-line comment\n");
    } else {
        printf("Line is not a comment\n");
    }
}

/**********************************
C program to find data type
**********************************/

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
# define MAX_INPUT 100
  
int main()
{
    // To read input
    char value[MAX_INPUT] = "";
  
    // To store numeric value of input if a 
    // number (float or integer)
    double temp;
  
    // To store integral value of input
    int n;
  
    // To store string value of input
    char str[MAX_INPUT] = "";
  
    // Precision for integer checking
    double val = 1e-12;
  
    fgets(value, 100, stdin); // Read input
  
    // Check for integers.
    if (sscanf(value, "%lf", &temp) == 1) 
    {
        n = (int)temp; // typecast to int.
        if (fabs(temp - n) / temp > val) 
            printf("The input is a floating point\n");        
        else 
            printf("The input is an integer\n");        
    }
  
    // Check for string 
    else if (sscanf(value, "%s", str) == 1)     
        printf("The input is a string\n");
      
    else // No match.    
        printf("input not recognized\n");    
}