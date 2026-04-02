import { useState } from "react";
import { Fieldset, TextInput, sanitiseString } from "author-design-system-react";
import { ISOToDMYMHValues } from "@/utils/datetime/datetime";

export default function DateTimePicker(props) {
    const releaseDate = ISOToDMYMHValues(props.releaseDate);
    const [day, setDay] = useState(releaseDate?.day || "");
    const [month, setMonth] = useState(releaseDate?.month || "");
    const [year, setYear] = useState(releaseDate?.year || "");
    const [hour, setHour] = useState(releaseDate?.hour || "");
    const [minutes, setMinutes] = useState(releaseDate?.minutes || "");

    const buildReleaseDateValue = () => {
    if (!day || !month || !year || !hour || !minutes) {
        return "";
    }

    const date = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minutes, 10)
    );

    return isNaN(date.getTime()) ? "" : date.toISOString();
};

    const sanitisedId = sanitiseString(props.id);
    const sanitisedDataTestId = sanitiseString(props.dataTestId);

    const fields = (
        <div className="ons-field-group">
            <TextInput
                id={`${sanitisedId}-day`}
                label={{
                    text: "Day",
                    id: `${sanitisedId}-day-label`,
                }}
                onChange={e => setDay(e.target.value)}
                width="2"
                min={1}
                max={31}
                maxLength={2}
                type="number"
                value={day}
                name={"release-date-day"}
                dataTestId={`${sanitisedDataTestId}-day`}
            />

            <TextInput
                id={`${sanitisedId}-month`}
                label={{
                    text: "Month",
                    id: `${sanitisedId}-month-label`,
                }}
                onChange={e => setMonth(e.target.value)}
                width="2"
                min={1}
                max={12}
                maxLength={2}
                type="number"
                value={month}
                name={"release-date-month"}
                dataTestId={`${sanitisedDataTestId}-month`}
            />

            <TextInput
                id={`${sanitisedId}-year`}
                label={{
                    text: "Year",
                    id: `${sanitisedId}-year-label`,
                }}
                onChange={e => setYear(e.target.value)}
                width="4"
                min={1000}
                max={3000}
                maxLength={4}
                type="number"
                value={year}
                name={"release-date-year"}
                dataTestId={`${sanitisedDataTestId}-year`}
            />

            <TextInput
                id={`${sanitisedId}-hour`}
                label={{
                    text: "Hours",
                    id: `${sanitisedId}-hour-label`,
                }}
                onChange={e => setHour(e.target.value)}
                width="3"
                min={0}
                max={24}
                maxLength={2}
                type="number"
                value={hour}
                name={"release-date-hour"}
                dataTestId={`${sanitisedDataTestId}-hour`}
            />

            <TextInput
                id={`${sanitisedId}-minutes`}
                label={{
                    text: "Minutes",
                    id: `${sanitisedId}-minutes-label`,
                }}
                onChange={e => setMinutes(e.target.value)}
                width="3"
                min={0}
                max={59}
                maxLength={2}
                type="number"
                value={minutes}
                name={"release-date-minutes"}
                dataTestId={`${sanitisedDataTestId}-minutes`}
            />

            <input
                id={`${sanitisedId}-value`}
                data-testid={`${sanitisedDataTestId}-value`}
                name="release-date-value"
                type="hidden"
                value={buildReleaseDateValue()}
            />
        </div>
    );

    return (
        <div className="ons-u-mb-l">
            <Fieldset
                id={sanitisedId}
                legend={props.legend}
                description={props.description}
                dataTestId={`fieldset-${sanitisedDataTestId}`}
                error={(props.errors && props.errors.release_date) ? {id:'release-date-error', text: props.errors.release_date} : null} 
            >
                {fields}
            </Fieldset>

        </div>
    );
}
