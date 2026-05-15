// tic tac gaaaaaaaaaaaaame ☺️☺️☺️
#include <iostream>
using namespace std;
// this function used to display the postions to user firstly
char arr[3][3] = {
    {'1', '2', '3'},
    {'4', '5', '6'},
    {'7', '8', '9'}};

char player = 'X';

void print()
{
    cout << "_____________________" << endl;
    for (int r = 0; r < 3; r++)
    {
        cout << "| ";
        for (int c = 0; c < 3; c++)
        {
            cout << arr[r][c] << " ";
        }
        cout << "|" << endl;
    }
    cout << "_____________________" << endl;
}

// this func take the input from user and replace it with X or O
void replace()
{
    int postion;
    cout << "Enter your postion"
         << "(" << player << ")" << endl;
    cin >> postion;

    for (int r = 0; r < 3; r++)
    {
        for (int c = 0; c < 3; c++)
        {
            if (arr[r][c] == postion + '0')
            {
                arr[r][c] = player;
            }
        }
    }

    // So that two people can play one with the X and one with the O
    if (player == 'X')
    {
        player = 'O';
    }
    else
        player = 'X';
}

// thats check thce rows if have three x or three o
char checkWinner()
{
    int x = 0, o = 0, counter = 0;

    for (int r = 0; r < 3; r++)
    {
        x = 0;
        o = 0;

        for (int c = 0; c < 3; c++)
        {
            if (arr[r][c] == 'X')
            {
                x++;
            }
            else if (arr[r][c] == 'O')
            {
                o++;
            }
        }

        if (x == 3)
        {
            return 'X';
        }
        if (o == 3)
        {
            return 'O';
        }
    }

    // thats check thce col if have three x or three o
    for (int c = 0; c < 3; c++)
    {
        x = 0;
        o = 0;

        for (int r = 0; r < 3; r++)
        {
            if (arr[r][c] == 'X')
            {
                x++;
            }
            else if (arr[r][c] == 'O')
            {
                o++;
            }
        }

        if (x == 3)
        {
            return 'X';
        }
        if (o == 3)
        {
            return 'O';
        }
    }

    //
    if (arr[0][0] == 'X' && arr[1][1] == 'X' && arr[2][2] == 'X')
    {
        return 'X';
    }

    if (arr[0][0] == 'O' && arr[1][1] == 'O' && arr[2][2] == 'O')
    {
        return 'O';
    }

    //
    if (arr[0][2] == 'X' && arr[1][1] == 'X' && arr[2][0] == 'X')
    {
        return 'X';
    }

    if (arr[0][2] == 'O' && arr[1][1] == 'O' && arr[2][0] == 'O')
    {
        return 'O';
    }

    for (int r = 0; r < 3; r++)
    {
        for (int c = 0; c < 3; c++)
        {
            if (arr[r][c] != 'X' && arr[r][c] != 'O')
            {
                counter++;
            }
        }
    }

    if (counter == 0)
    {
        return '=';
    }

    return '*';
}

int main()
{
    while (checkWinner() == '*')
    {
        print();
        replace();
    }

    print();

    if (checkWinner() == 'X')
    {
        cout << "the winner is player X ☺️☺️" << endl;
    }
    else if (checkWinner() == 'O')
    {
        cout << "the winner is player O ☺️☺️" << endl;
    }
    else
    {
        cout << " NO winner 🥴🥴 " << endl;
    }

    return 0;
}