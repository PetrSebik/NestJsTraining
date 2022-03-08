/// <reference types="cypress" />
import { v4 as uuid } from 'uuid'

describe('test the Task Manager API', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/api/');
    })

    const body = {
        'email': `${uuid()}@gmail.com`,
        'password': '123456password'
    };
    let headers = {
        'content-type': 'application/json',
    };
    let dog_task_uuid = '';

    it('auth namespace exists', () => {
        cy.get('[id=operations-tag-auth]').should('have.class', 'opblock-tag');
    })

    it('register new account', () => {
        cy.request('POST', 'auth/signUp', body).should((response) => {
            expect(response.status).to.eq(201);
        })
    })

    it('log in to the new account', () => {
        cy.request('POST', 'auth/signIn', body).should((response) => {
            cy.log(JSON.stringify(response.body['accessToken']));
            headers['Authorization'] = `Bearer ${response.body['accessToken']}`;
        })
    })

    it('check that tasks are empty', () => {
        cy.request({
            method: 'GET',
            url: 'tasks',
            headers: headers,
        }).should((response) => {
            expect(response.status).to.eq(200)
        })
    })

    it('test adding cleanup task', () => {
        let body = {
            'title': 'clean up',
            'description': 'take out the trash'
        }
        cy.request({
            method: 'POST',
            url: 'tasks',
            body: body,
            headers: headers
        }).should((response) => {
            expect(response.status).to.eq(201);
            expect(response.body['title']).to.eq(body['title']);
            expect(response.body['description']).to.eq(body['description']);
            expect(response.body['status']).to.eq('OPEN')
        })
    })

    it('add another dog task', () => {
        let body = {
            'title': 'walk the dog',
            'description': 'go on the walk with the doggo'
        }
        cy.request({
            method: 'POST',
            url: 'tasks',
            body: body,
            headers: headers
        }).should((response) => {
            expect(response.status).to.eq(201);
            dog_task_uuid = response.body['id'];
        })
    })

    it('update the dog task status', () => {
        let body = {
            'status': 'IN_PROGRESS'
        }
        cy.request({
            method: 'PATCH',
            url: `tasks/${dog_task_uuid}/status`,
            body: body,
            headers: headers
        }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body['status']).to.eq('IN_PROGRESS');
        })
    })

    it('get all the tasks', () => {
        cy.request({
            method: 'GET',
            url: 'tasks',
            headers: headers
        }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(2);
            expect(response.body[0]['status']).to.eq('OPEN');
            expect(response.body[1]['status']).to.eq('IN_PROGRESS');
        })
    })

    it('delete the dog task', () => {
        cy.request({
            method: 'DELETE',
            url: `tasks/${dog_task_uuid}`,
            headers: headers
        }).should((response) => {
            expect(response.status).to.eq(200);
        })
    })

    it('try to get the dog task which should be deleted', () => {
        cy.request({
            method: 'GET',
            url: `tasks/${dog_task_uuid}`,
            headers: headers,
            failOnStatusCode: false,
        }).should((response) => {
            expect(response.status).to.eq(404);
        })
    })

    it('try call admin endpoint with user who is not admin', () => {
        cy.request({
            method: 'GET',
            url: `tasks/admin`,
            headers: headers,
            failOnStatusCode: false,
        }).should((response) => {
            expect(response.status).to.eq(403);
        })
    })
})