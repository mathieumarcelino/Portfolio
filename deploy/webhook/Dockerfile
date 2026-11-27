# Récepteur du webhook Strapi : reçoit « Publier » et reconstruit le site.
# Image officielle du client Docker (avec les plugins compose et buildx)
# + webhook (https://github.com/adnanh/webhook).
FROM docker:29-cli

RUN apk add --no-cache webhook

COPY hooks.yaml /etc/webhook/hooks.yaml
COPY entrypoint.sh trigger.sh rebuild.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/trigger.sh /usr/local/bin/rebuild.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
