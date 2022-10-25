import {jest} from '@jest/globals';
import path from 'node:path';
import {promises as fs} from 'node:fs';
import process from '../lib/process.js';

const __dirname = new URL('.', import.meta.url).pathname;

const readSync = async (name) => {
    let fixtureFileName = path.join(__dirname, './', 'fixtures', name);
    return fs.readFile(fixtureFileName, {encoding: 'utf8'});
};

describe('Process', function () {
    beforeEach(function () {
        process.processHTMLContent = jest.fn(() => {
            return 'Example content';
        });
    });

    test('Can convert a single published post', async function () {
        let ctx = {
            options: {
                drafts: true,
                pages: true
            }
        };
        const input = await readSync('sample.xml');
        const processed = await process.all(input, ctx);

        const post = processed.posts[1];

        expect(post).toBeObject();
        expect(post.url).toEqual('https://example.com/blog/basic-post.html');

        const data = post.data;

        expect(data).toBeObject();
        expect(data.slug).toEqual('basic-post');
        expect(data.title).toEqual('Basic Post');
        expect(data.status).toEqual('published');
        expect(data.published_at).toEqual(new Date('2013-06-07T03:00:44.000Z'));
        expect(data.created_at).toEqual(new Date('2013-06-07T03:00:44.000Z'));
        expect(data.updated_at).toEqual(new Date('2013-06-07T03:00:44.000Z'));
        expect(data.feature_image).toEqual('https://images.unsplash.com/photo-1601276861758-2d9c5ca69a17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1268&q=80');
        expect(data.type).toEqual('post');
        // We're not testing `data.html` output here. That happens in @tryghost/mg-wp-api

        const tags = data.tags;

        expect(tags).toBeArrayOfSize(4);
        expect(tags[0].url).toEqual('/tag/company-news');
        expect(tags[0].data.slug).toEqual('company-news');
        expect(tags[0].data.name).toEqual('Company News');
        expect(tags[1].url).toEqual('/tag/has-images');
        expect(tags[1].data.slug).toEqual('has-images');
        expect(tags[1].data.name).toEqual('Has Images');
        expect(tags[2].url).toEqual('/tag/programming');
        expect(tags[2].data.slug).toEqual('programming');
        expect(tags[2].data.name).toEqual('Programming');
        expect(tags[3].url).toEqual('migrator-added-tag');
        expect(tags[3].data.slug).toEqual('hash-wp');
        expect(tags[3].data.name).toEqual('#wp');

        const author = data.author;

        expect(author).toBeObject();
        expect(author.url).toEqual('hermione-example-com');
        expect(author.data.slug).toEqual('hermione-example-com');
        expect(author.data.name).toEqual('Hermione Granger');
        expect(author.data.email).toEqual('hermione@example.com');
    });

    test('Can convert a single draft post', async function () {
        let ctx = {
            options: {
                drafts: true,
                pages: true
            }
        };
        const input = await readSync('sample.xml');
        const processed = await process.all(input, ctx);

        const post = processed.posts[0];

        expect(post).toBeObject();
        expect(post.url).toEqual('https://example.com/draft-post');

        const data = post.data;

        expect(data).toBeObject();
        expect(data.slug).toEqual('draft-post');
        expect(data.title).toEqual('Draft Post');
        expect(data.status).toEqual('draft');
        expect(data.published_at).toEqual(new Date('2013-11-02T23:02:32.000Z'));
        expect(data.created_at).toEqual(new Date('2013-11-02T23:02:32.000Z'));
        expect(data.updated_at).toEqual(new Date('2013-11-02T23:02:32.000Z'));
        expect(data.feature_image).toBeFalsy();
        expect(data.type).toEqual('post');
        // We're not testing `data.html` output here. That happens in @tryghost/mg-wp-api

        const tags = data.tags;

        expect(tags).toBeArrayOfSize(3);
        expect(tags[0].url).toEqual('/tag/company-news');
        expect(tags[0].data.slug).toEqual('company-news');
        expect(tags[0].data.name).toEqual('Company News');
        expect(tags[1].url).toEqual('/tag/programming');
        expect(tags[1].data.slug).toEqual('programming');
        expect(tags[1].data.name).toEqual('Programming');
        expect(tags[2].url).toEqual('migrator-added-tag');
        expect(tags[2].data.slug).toEqual('hash-wp');
        expect(tags[2].data.name).toEqual('#wp');

        const author = data.author;

        expect(author).toBeObject();
        expect(author.url).toEqual('harry-example-com');
        expect(author.data.slug).toEqual('harry-example-com');
        expect(author.data.name).toEqual('Harry Potter');
        expect(author.data.email).toEqual('harry@example.com');
    });

    test('Can convert a published page', async function () {
        let ctx = {
            options: {
                drafts: true,
                pages: true
            }
        };
        const input = await readSync('sample.xml');
        const processed = await process.all(input, ctx);

        const page = processed.posts[2];

        expect(page).toBeObject();
        expect(page.url).toEqual('https://example.com/services');

        const data = page.data;

        expect(data).toBeObject();
        expect(data.slug).toEqual('services');
        expect(data.title).toEqual('Services');
        expect(data.status).toEqual('published');
        expect(data.published_at).toEqual(new Date('2017-05-27T11:33:38.000Z'));
        expect(data.feature_image).toBeFalsy();
        expect(data.type).toEqual('page');
        // We're not testing `data.html` output here. That happens in @tryghost/mg-wp-api

        const tags = data.tags;

        expect(tags).toBeArrayOfSize(1);
        expect(tags[0].url).toEqual('migrator-added-tag');
        expect(tags[0].data.slug).toEqual('hash-wp');
        expect(tags[0].data.name).toEqual('#wp');

        const author = data.author;

        expect(author).toBeObject();
        expect(author.url).toEqual('migrator-added-author');
        expect(author.data.slug).toEqual('migrator-added-author');
    });
});
