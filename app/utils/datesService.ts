class DatesService {
    /**
     * Obtient le début de la semaine (lundi) pour une date donnée
     */
    getWeekStart(date: Date | string): Date {
        const newDate = new Date(date);

        newDate.setHours(0, 0, 0, 0);

        const day = newDate.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        newDate.setDate(newDate.getDate() + diff);

        return newDate;
    }

    /**
     * Formate une date en string DD/MM/YYYY
     */
    formatDate(date: Date | string): string {
        const newDate = new Date(date);

        const day = String(newDate.getDate()).padStart(2, "0");

        const month = String(newDate.getMonth() + 1).padStart(2, "0");

        const year = newDate.getFullYear();

        return `${day}/${month}/${year}`;
    }

    /**
     * Formate une date en string abrégé DD/MM/YY
     */
    formatDateShort(date: Date | string): string {
        const newDate = new Date(date);

        const day = String(newDate.getDate()).padStart(2, "0");

        const month = String(newDate.getMonth() + 1).padStart(2, "0");

        const year = String(newDate.getFullYear()).slice(-2);

        return `${day}/${month}/${year}`;
    }

    /**
     * Génère un tableau de tous les débuts de semaine entre startDate et endDate
     */
    generateWeekRange(startDate: Date, endDate: Date): Date[] {
        const weeks: Date[] = [];
        const start = this.getWeekStart(new Date(startDate));
        const end = new Date(endDate);

        end.setHours(0, 0, 0, 0);

        const current = new Date(start);

        while (current <= end) {
            weeks.push(new Date(current));
            current.setDate(current.getDate() + 7); // Passer à la semaine suivante
        }

        return weeks;
    }
}

export const datesService = new DatesService();
