import matplotlib.pyplot as plt# dy el lib el fiha el histo w el polygon 3shan n2dr nrsmhom
import math # dy lib tanya 3shan lma n3oz n3ml celling le el arkam 

while True:

    print("\n================================")
    print("Frequency Distribution Program")
    print("================================")

    data_type = input("Enter data type (grouped / ungrouped): ").lower()

    # =========================================
    # DA EL GROUPED BOSO 3LEH  
    # =========================================

    if data_type == "grouped":

        data = input("Enter values separated by space: ").split()

        n = len(data)

        unique_types = []
        for x in data:
            if x not in unique_types:
                unique_types.append(x)

        frequency = [data.count(x) for x in unique_types] # HNA BAKHALIH Y3D EL VALUES B ESTAKHDAM FUN ESMHA COUNT 

        rf = [f / n for f in frequency] # DA RULE EL F
        pf = [(f / n) * 100 for f in frequency]# W HNA DARBTO FE 100 3SHAN EL PF 

        print("\nGrouped Frequency Table")# W DY  LE EL SHAKL
        print("--------------------------------")#DY LE EL SHAKL  
        print("Type\tF\tRF\tPF")#HNA 3SHAN YTL3 FE SHAKL TABLE

        for i in range(len(unique_types)):
            print(unique_types[i], "\t", frequency[i], "\t", round(rf[i], 3), "\t", round(pf[i], 2))

    # =========================================
    # UNGROUPED
    # =========================================
#########################
# hna e7na bn7sb kol haga lw7dha zy el 7a2ia b el zabt w fe el akher bntal3 3l table
########################
    elif data_type == "ungrouped":

        data = []

        print("Enter elements one by one (type 0000 to stop):")

        while True:
            value = input("Enter value: ")

            if value == "0000":
                break

            data.append(int(value))

        n = len(data)
        print("\nn =", n)

        # =========================================
        # k ####### hna 7atet option 3shan lw fe el so2al al 3add el classes lw m2alsh hn7sbha e7naa 3ady
        # =========================================

        choice_k = input("Do you want to choose number of classes? (yes/no): ").lower()

        if choice_k == "yes":
            k = int(input("Enter number of classes: "))
        else:
            k = 1
            while (2 ** k) <= n:### b el rule dy 
                k += 1

        print("k =", k)

        # =========================================
        # RANGE
        # =========================================

        max_val = max(data)
        min_val = min(data)

        range_val = max_val - min_val
        print("range =", range_val)

        # =========================================
        # CLASS WIDTH
        # =========================================

        w = math.ceil(range_val / k)
        print("class width =", w)

        # =========================================
        # CLASS INTERVALS [a, b[ ### hna 3amlto open interval
        # =========================================

        classes = []
        lower = min_val

        for i in range(k):
            upper = lower + w
            classes.append((lower, upper))
            lower = upper

        # =========================================
        # FREQUENCY
        # =========================================

        frequency = []

        for c in classes:
            count = 0
            for x in data:
                if c[0] <= x < c[1]:
                    count += 1
            frequency.append(count)

        # =========================================
        # RF + CF + MIDPOINT
        # =========================================

        rf = [f / n for f in frequency]

        cf = []
        total = 0
        for f in frequency:
            total += f
            cf.append(total)

        mid = [(c[0] + c[1]) / 2 for c in classes]

        # =========================================
        # TABLE OUTPUT
        # =========================================

        print("\nUngrouped Frequency Table")
        print("========================================")
        print("Class\t\tF\tRF\tCF\tMid")
        print("----------------------------------------")

        for i in range(k):
            print(f"[{classes[i][0]} - {classes[i][1]}[\t{frequency[i]}\t{round(rf[i],3)}\t{cf[i]}\t{mid[i]}")

        # =========================================
        # GRAPHS SELECTION
        # =========================================

        print("\nChoose graph:")
        print("1 - Histogram")
        print("2 - Frequency Polygon")
        print("3 - Ogive")
        print("4 - All")

        choice = input("Enter choice: ")

        if choice == "1" or choice == "4":
            plt.hist(data, bins=[c[0] for c in classes] + [classes[-1][1]], edgecolor='black')
            plt.title("Histogram")
            plt.show()

        if choice == "2" or choice == "4":
            plt.plot(mid, frequency, marker='o')
            plt.title("Frequency Polygon")
            plt.show()

        if choice == "3" or choice == "4":
            upper_bounds = [c[1] for c in classes]
            plt.plot(upper_bounds, cf, marker='o')
            plt.title("Ogive")
            plt.show()

    else:
        print("Invalid input")

    # =========================================
    # RESTART
    # =========================================

    again = input("\nDo you want to solve another problem? (yes/no): ").lower()

    if again != "yes":
        print("Program closed.")
        break