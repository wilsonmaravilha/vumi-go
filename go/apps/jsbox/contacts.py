# -*- test-case-name: go.apps.jsbox.tests.test_contacts -*-
# -*- coding: utf-8 -*-

from twisted.internet.defer import inlineCallbacks, returnValue

from vumi import log
from vumi.persist.fields import ValidationError
from vumi.application.sandbox import SandboxResource, SandboxError

from go.vumitools.contact import Contact, ContactError


class ContactsResource(SandboxResource):
    def _contact_store_for_api(self, api):
        return self.app_worker.user_api_for_api(api).contact_store

    def _parse_get(self, command):
        if 'addr' not in command:
            raise SandboxError("'addr' needs to be specified for command")

        if 'delivery_class' not in command:
            if 'delivery_class' in self.config:
                command['delivery_class'] = self.config['delivery_class']
            else:
                raise SandboxError(
                    "'delivery_class' needs to be specified for command")

    @inlineCallbacks
    def handle_get(self, api, command):
        try:
            self._parse_get(command)

            contact = yield self._contact_store_for_api(api).contact_for_addr(
                command['delivery_class'],
                command['addr'],
                create=False)
        except (SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        if contact is None:
            returnValue(self.reply(
                command, success=False, reason="Contact not found"))

        returnValue(self.reply(
            command,
            success=True,
            contact=contact.get_data()))

    @inlineCallbacks
    def handle_get_or_create(self, api, command):
        try:
            self._parse_get(command)
            contact = yield self._contact_store_for_api(api).contact_for_addr(
                command['delivery_class'],
                command['addr'],
                create=True)
        except (ValidationError, SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        returnValue(self.reply(
            command,
            success=True,
            contact=contact.get_data()))

    @staticmethod
    def pick_fields(collection, *fields):
        return dict((k, collection[k]) for k in fields if k in collection)

    @inlineCallbacks
    def handle_update(self, api, command):
        try:
            if 'key' not in command:
                raise SandboxError("'key' needs to be specified for command")

            if 'fields' not in command:
                raise SandboxError(
                    "'fields' needs to be specified for command")

            store = self._contact_store_for_api(api)
            fields = self.pick_fields(
                command['fields'], *Contact.field_descriptors)
            yield store.update_contact(command['key'], **fields)
        except (SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        returnValue(self.reply(command, success=True))

    @inlineCallbacks
    def _update_dynamic_field(self, field_name, api, command):
        try:
            if 'contact_key' not in command:
                raise SandboxError(
                    "'contact_key' needs to be specified for command")

            if 'field' not in command:
                raise SandboxError("'field' needs to be specified for command")

            if 'value' not in command:
                raise SandboxError("'value' needs to be specified for command")

            store = self._contact_store_for_api(api)
            contact = yield store.get_contact_by_key(command['contact_key'])

            field = getattr(contact, field_name)
            field[command['field']] = command['value']
            yield contact.save()
        except (SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        returnValue(self.reply(command, success=True))

    def handle_update_extra(self, api, command):
        return self._update_dynamic_field('extra', api, command)

    def handle_update_subscription(self, api, command):
        return self._update_dynamic_field('subscription', api, command)

    @inlineCallbacks
    def handle_new(self, api, command):
        try:
            if 'contact' not in command:
                raise SandboxError(
                    "'contact' needs to be specified for command")

            fields = self.pick_fields(command['contact'],
                                      *Contact.field_descriptors)
            contact_store = self._contact_store_for_api(api)
            contact = yield contact_store.new_contact(**fields)
        except (SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        returnValue(self.reply(command, success=True, key=contact.key))

    @inlineCallbacks
    def handle_save(self, api, command):
        try:
            if 'contact' not in command:
                raise SandboxError(
                    "'contact' needs to be specified for command")

            fields = command['contact']
            if 'key' not in fields:
                raise SandboxError(
                    "'key' needs to be specified for as a 'contact' field for "
                    "command")

            # ensure user account can't be changed
            fields.pop('user_account', None)

            # raise an exception if the contact does not exist
            key = fields.pop('key')
            contact_store = self._contact_store_for_api(api)
            yield contact_store.get_contact_by_key(key)

            contact = contact_store.contacts(
                key,
                user_account=contact_store.user_account_key,
                **fields)

            yield contact.save()
        except (SandboxError, ContactError) as e:
            log.warning(str(e))
            returnValue(self.reply(command, success=False, reason=unicode(e)))

        returnValue(self.reply(command, success=True))