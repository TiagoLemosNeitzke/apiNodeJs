import { ICreate } from "../interfaces/SchedulesInterfaces";
import { getHours, isBefore, startOfHour } from "date-fns";
import { SchedulesRepository } from "../repositories/SchedulesRepository";

export class SchedulesServices {
    private schudelesRepository: SchedulesRepository;
    constructor() {
        this.schudelesRepository = new SchedulesRepository();
    }

    async create({ name, phone, date, user_id }: ICreate) {
        const dateFormatted = new Date(date);

        const hourStart = startOfHour(dateFormatted);

        const hour = getHours(hourStart);

        if (hour <= 8 || hour >= 17) {
            throw new Error('You can only create schedules between 8am and 5pm.');
        }

        //impedindo que o usuário crie um agendamento em uma data passada

        if (isBefore(hourStart, Date.now())) {
            throw new Error('Past dates are not permitted.');
        }

        //verificando se o horário está disponível
        const checkAvailability = await this.schudelesRepository.find(hourStart, user_id);

        if (checkAvailability) {
            throw new Error('This schedule is already booked.');
        }
        const create = await this.schudelesRepository.create({
            name, 
            phone, 
            date: hourStart,
            user_id
        });

        return create;
    }

    async index(date: Date) {
        const result = await this.schudelesRepository.findAll(date);
        return result;
    }

    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);
        if (isBefore(hourStart, Date.now())) {
            throw new Error('Past dates are not permitted.');
        }

        //verificando se o horário está disponível
        const checkAvailability = await this.schudelesRepository.find(hourStart, user_id);

        if (checkAvailability) {
            throw new Error('This schedule is already booked.');
        }

        const result = await this.schudelesRepository.update(id, date);

        return result;
    }
}