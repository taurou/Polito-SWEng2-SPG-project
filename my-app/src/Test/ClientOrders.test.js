import * as React from "react";
import {render, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";

import {ClientOrders} from "../Components/ClientOrders";
import API from "../API";

describe('Test for ClientOrders.js', () => {

    const clientOrders = [{
        OrderID: "wBGvIF45zhSvGcYe4pWk",
        Status: "open",
        ClientID: "d01f9dd2-91f4-4bba-a0c8-82b72197c1c8",
        Phoneno: "2907654356",
        Email: "eva.jobs@apple.com",
        Zipcode: "10129",
        State: "TO",
        Address: "Via Nizza 40",
        City: "Turin",
        Name: "Eva",
        Password: "supersecret3",
        Role: "Client",
        Surname: "Jobs",
        Timestamp: "08-01-2022 14:14:00",
        ProductInOrder: [
            {
                ImageID: "d00e6d5b-7f12-403b-bf81-3f825c1d5393",
                NameProduct: "Finocchio",
                Confirmed: "",
                ProductID: "Mqn59ZJN1Q8cyrj3oGj",
                FarmerID: "3a875cbf-6bb7-44e9-b3c8-cb9b1607a044",
                Price: 8,
                number: 2
            },
            {
                ProductID: "Mqn4HUlBrmA7gRw2Bly",
                NameProduct: "Wurstel di suino",
                FarmerID: "3a875cbf-6bb7-44e9-b3c8-cb9b1607a044",
                Price: 3,
                ImageID: "3a1e9e73-1df7-43ed-95ee-9b224e4f3a25",
                number: 1
            },
            {
                number: 1,
                Price: 8,
                ProductID: "Mqn5Fe57EePWUW6WeoI",
                FarmerID: "3a875cbf-6bb7-44e9-b3c8-cb9b1607a044",
                ImageID: "6fd5e5df-5fd3-4f15-98b3-8a75824ae14a",
                NameProduct: "Costine"
            }
        ],
        DeliveryDate: "",
        DeliveryPlace: "",
        pickupTimestamp: "",
        notRetired: "false"
    }];

    const mockReturnTimeMachine = jest.fn();
    const mockTimeMachine = '';
    const mockGetClientOrders = (API.getClientOrders = jest.fn());

    test('Correct render of the component without orders', async () => {
        mockReturnTimeMachine.mockReturnValue('12-12-2021 11:11:11');
        mockGetClientOrders.mockResolvedValue([]);
        const {getByText, getAllByText} = render(
            <Router>
                <ClientOrders
                    timeMachine={mockReturnTimeMachine}
                    reloadTime={mockTimeMachine}/>
            </Router>
        );

        await waitFor(() => {
            getByText('You have no orders yet');
        });
    });

    test('Correct render of the component with orders', async () => {
        mockReturnTimeMachine.mockReturnValue('01-08-2022 15:15:15');
        mockGetClientOrders.mockResolvedValue(clientOrders);
        const {getByText, getAllByText} = render(
            <Router>
                <ClientOrders
                    timeMachine={mockReturnTimeMachine}
                    reloadTime={'01-08-2022 15:15:15'}/>
            </Router>
        );

        await waitFor(() => {
            getByText('Order #wBGvIF45zhSvGcYe4pWk');
            getByText('Eva Jobs');
            getByText('08-01-2022 14:14:00');
            getByText('Via Nizza 40, TO');
            getByText('Finocchio');
            getAllByText('Quantity: 2');
            getAllByText('Price: €8.00');
            getByText('Wurstel di suino');
            getAllByText('Quantity: 1');
            getAllByText('Price: €3.00');
            getByText('Total: €19');
            getByText('Request Delivery')
            getByText('Request Pickup')
            getByText('open');
        });
    });

    test('Request delivery open and close modal', async () => {
        mockReturnTimeMachine.mockReturnValue('');
        mockGetClientOrders.mockResolvedValue(clientOrders);
        const {getByText, getByLabelText, getByPlaceholderText} = render(
            <Router>
                <ClientOrders
                    timeMachine={mockReturnTimeMachine}
                    reloadTime={'01-12-2022 15:15:00'}/>
            </Router>
        );

        await waitFor(async () => {
            fireEvent.click(getByText('Request Delivery'));

            getByText('Delivery address');
            getByText('Date');
            getByText('Time');

            fireEvent.click(getByText('Confirm'));



        });
    });




    test('Request pickup wrong', async () => {
        mockReturnTimeMachine.mockReturnValue('01-12-2022 07:00:15');
        mockGetClientOrders.mockResolvedValue(clientOrders);
        const {getByText} = render(
            <Router>
                <ClientOrders
                    timeMachine={mockReturnTimeMachine}
                    reloadTime={'01-08-2022 15:15:15'}/>
            </Router>
        );

        await waitFor(async () => {
            fireEvent.click(getByText('Request Pickup'));

            getByText('Select a date for pickup on-site');
            getByText('Date');
            getByText('Time');
            fireEvent.click(getByText('Confirm'));

            await waitFor(() => {
                getByText('Error requesting pickup');
                getByText('Make sure you have selected a date or chosen a correct time range (09:00-19:00)')
            });

            fireEvent.click(getByText('Close'));
        });
    });
});
